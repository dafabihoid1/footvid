import puppeteer from "puppeteer-core";   // note: puppeteer-core, not full puppeteer

// Detect CI or Vercel:
const isCI = process.env.GITHUB_ACTIONS === "true";
const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";

async function launchBrowser() {
  // In CI/prod, use system-installed chromium
  if (isCI || isProd) {
    return await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
  } else {
    // Local dev can still use bundled Puppeteer
    const full = await import("puppeteer");
    return full.default.launch({ headless: true });
  }
}

export async function fetchLeibenTable() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();

  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen",
    { waitUntil: "networkidle0" }
  );

  const rows = await page.evaluate(() => {
    // simply pick the first <table> (the "Gesamt" table)
   const container = document.querySelector(
    'div.u-widget_content.NORMAL.u-widget_content--show'
  );
  if (!container) return [];

  // 2) find the <table> inside it
  const table = container.querySelector('table');
  if (!table) return [];

    return Array.from(table.querySelectorAll("tbody tr")).map(tr => {
      const cells = Array.from(tr.querySelectorAll("td")).map(td =>
        td.textContent.trim()
      );
      return {
        Rang:           cells[0],
        Mannschaft:     cells[3],
        Spiele:         cells[4],
        Siege:          cells[6],
        Unentschieden:  cells[7],
        Niederlagen:    cells[8],
        Torverhaeltnis: cells[10],
        Tordifferenz:   cells[11],
        Punkte:         cells[12],
      };
    });
  });

  await browser.close();
  console.log("✅ Scraped", rows.length, "rows");
  return rows;
}




 function formatForSupabase(dateText, timeText) {
  const dayMonth = dateText.replace(/^[^.]+\.\s*/, "").replace(/\.$/, "");
  const [dayStr, monthStr] = dayMonth.split(".");

  const day   = parseInt(dayStr,   10);
  const month = parseInt(monthStr, 10);

  // 2) Determine year: assume season spans two calendar years.
  //    If month is later than the current month, go back one year.
  const now         = new Date();
  const currentYear = now.getFullYear();
  const currentMonth= now.getMonth() + 1; // 1–12

  const year = month > currentMonth
    ? currentYear - 1
    : currentYear;

  // 3) Zero‐pad helpers
  const pad = (n) => n.toString().padStart(2, "0");

  // 4) Build ISO date and time
  const isoDate = `${year}-${pad(month)}-${pad(day)}`;      // "2024-07-19" or "2025-05-29"
  const isoTime = `${pad(parseInt(timeText.slice(0,2),10))}:${pad(parseInt(timeText.slice(3,5),10))}:00`;

  return { date: isoDate, time: isoTime };
}


export async function fetchLeibenGamePlan() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();

  await page.goto(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Spiele',
    { waitUntil: 'networkidle0' }
  )

  const games = await page.$$eval(
    '.widget-list.spiele .widget-list_container',
    containers => containers.map(node => {
      // date/time block (large view)
      const lgDate = node.querySelector('.widget-match_date--lg')
      let dateText = '', timeText = ''
      if (lgDate) {
        // innerHTML looks like "Fr. 19.07. <span class='widget-large'>18:00</span>"
        dateText = lgDate.childNodes[0].textContent.trim()
        timeText = lgDate.querySelector('.widget-large')?.textContent.trim() || ''
      } else {
        // fallback: small view
        const sm = node.querySelector('.widget-match_date--small')
        const parts = sm?.textContent.trim().split(' ')
        dateText = parts?.slice(0, 2).join(' ') || ''
        timeText = parts?.[2] || ''
      }

      
      const competition = node.querySelector('.widget-match_competition')?.textContent.trim() || ''
      const home        = node.querySelector('.widget-match_home-team')?.textContent.trim() || ''
      const away        = node.querySelector('.widget-match_other-team')?.textContent.trim() || ''
      const leftScore   = node.querySelector('.widget-scores_left')?.textContent.trim() || ''
      const rightScore  = node.querySelector('.widget-scores_right')?.textContent.trim() || ''
      const score       = leftScore && rightScore ? `${leftScore}:${rightScore}` : ''

      return {
        date:         formattedDate,      // e.g. "Fr. 19.07."
        time:         formattedTime,      // e.g. "18:00"
        competition,                 // e.g. "Testspiel" or "Liga"
        home,                        // home team name
        away,                        // away team name
        score                        // e.g. "3:1" or "" if not played
      }
    })
  )
  await browser.close()

const formattedGames = games.map(({ dateText, timeText, ...rest }) => {
  const { date, time } = formatForSupabase(dateText, timeText);
  return { date, time, ...rest };
});

return formattedGames;
}


//fetchLeibenGamePlan().then(rows => console.log(rows));
// export async function main() {
//   try {
//      await clearTabelle()
//     const scraped = await fetchLeibenTable()
//    for (const entry of scraped) {
//       await insertTabelle(entry)
//     }
//   } catch (err) {
//     console.error('Unexpected error:', err)
//   }
// }

// main()

//fetchLeibenTable().then(rows => console.log(rows)).catch(err => console.error(err));
