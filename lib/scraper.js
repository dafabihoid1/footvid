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

/**
 * Parse German-style dateText (e.g. "Fr. 19.07.") and timeText ("18:00")
 * and return ISO strings for Supabase date/time columns.
 */
function formatForSupabase(dateText, timeText) {
  const dayMonth = dateText.replace(/^[^.]+\.\s*/, "").replace(/\.$/, "");
  const [dayStr, monthStr] = dayMonth.split(".");

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // If month is > current month, assume last year
  const year = month > currentMonth ? currentYear - 1 : currentYear;

  const pad = (n) => n.toString().padStart(2, "0");
  const isoDate = `${year}-${pad(month)}-${pad(day)}`;
  const isoTime = `${pad(parseInt(timeText.slice(0, 2), 10))}:${pad(
    parseInt(timeText.slice(3, 5), 10)
  )}:00`;

  return { date: isoDate, time: isoTime };
}

export async function fetchLeibenTable() {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen",
    { waitUntil: "networkidle0" }
  );

  const rows = await page.evaluate(() => {
    const container = document.querySelector(
      'div.u-widget_content.NORMAL.u-widget_content--show'
    );
    if (!container) return [];

    const table = container.querySelector("table");
    if (!table) return [];

    return Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
      const cells = Array.from(tr.querySelectorAll("td")).map((td) =>
        td.textContent.trim()
      );
      return {
        Rang: cells[0],
        Mannschaft: cells[3],
        Spiele: cells[4],
        Siege: cells[6],
        Unentschieden: cells[7],
        Niederlagen: cells[8],
        Torverhaeltnis: cells[10],
        Tordifferenz: cells[11],
        Punkte: cells[12],
      };
    });
  });

  await browser.close();
  console.log("✅ Scraped table rows:", rows.length);
  return rows;
}

export async function fetchLeibenGamePlan() {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Spiele",
    { waitUntil: "networkidle0" }
  );

  // 1) Scrape raw dateText/timeText plus other fields
  const rawGames = await page.$$eval(
    ".widget-list.spiele .widget-list_container",
    (containers) =>
      containers.map((node) => {
        const lgDate = node.querySelector(".widget-match_date--lg");
        let dateText = "", timeText = "";
        if (lgDate) {
          dateText = lgDate.childNodes[0].textContent.trim();
          timeText =
            lgDate.querySelector(".widget-large")?.textContent.trim() || "";
        } else {
          const sm = node.querySelector(".widget-match_date--small");
          const parts = sm?.textContent.trim().split(" ");
          dateText = parts?.slice(0, 2).join(" ") || "";
          timeText = parts?.[2] || "";
        }

        const competition =
          node.querySelector(".widget-match_competition")?.textContent.trim() || "";
        const home =
          node.querySelector(".widget-match_home-team")?.textContent.trim() || "";
        const away =
          node.querySelector(".widget-match_other-team")?.textContent.trim() || "";
        const leftScore =
          node.querySelector(".widget-scores_left")?.textContent.trim() || "";
        const rightScore =
          node.querySelector(".widget-scores_right")?.textContent.trim() || "";
        const score = leftScore && rightScore ? `${leftScore}:${rightScore}` : "";

        return { dateText, timeText, competition, home, away, score };
      })
  );

  await browser.close();

  // 2) Format for Supabase in Node
  const formattedGames = rawGames.map(({ dateText, timeText, ...rest }) => {
    const { date, time } = formatForSupabase(dateText, timeText);
    return { date, time, ...rest };
  });

  console.log("✅ Scraped games:", formattedGames.length);
  return formattedGames;
}
