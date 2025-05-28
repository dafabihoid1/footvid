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

  // wait for all tables to be present in the DOM
  await page.waitForSelector("div.tab-content table");

  const rows = await page.evaluate(() => {
    // find the table whose closest .tab-pane has id="gesamt"
    const gesamtTable = Array.from(document.querySelectorAll("table")).find(table =>
      table.closest(".tab-pane")?.id === "gesamt"
    );
    if (!gesamtTable) return [];

    // grab headers
    const headers = Array.from(gesamtTable.querySelectorAll("thead th"))
                         .map(th => th.textContent.trim());

    // build rows keyed by header
    return Array.from(gesamtTable.querySelectorAll("tbody tr")).map(tr => {
      const cells = Array.from(tr.querySelectorAll("td"))
                         .map(td => td.textContent.trim());
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = cells[i] || "";
      });
      return obj;
    });
  });

  await browser.close();
  console.log(`✅ Scraped ${rows.length} Gesamt rows`);
  return rows;
}



export async function fetchLeibenGamePlan() {
  const browser = await puppeteer.launch({ headless: true })
  const page    = await browser.newPage()
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
        date:         dateText,      // e.g. "Fr. 19.07."
        time:         timeText,      // e.g. "18:00"
        competition,                 // e.g. "Testspiel" or "Liga"
        home,                        // home team name
        away,                        // away team name
        score                        // e.g. "3:1" or "" if not played
      }
    })
  )

  await browser.close()
  return games
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
