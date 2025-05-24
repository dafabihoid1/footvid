// lib/scraper.js
import puppeteerCore from "puppeteer-core";
import puppeteerDev from "puppeteer";

const isCI = process.env.GITHUB_ACTIONS === "true";
const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";

let _browser = null;
async function launchBrowser() {
  if (_browser) return _browser;

  if (isCI || isProd) {
    // Use the system-installed chromium-browser which has a working sandbox on Ubuntu runners
    _browser = await puppeteerCore.launch({
      executablePath: "/usr/bin/chromium-browser",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  } else {
    // Local development: use the bundled Puppeteer Chromium
    _browser = await puppeteerDev.launch({ headless: true });
  }

  return _browser;
}

export async function fetchLeibenTable() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();

  // speed up: only load the document HTML
  await page.setRequestInterception(true);
  page.on("request", req => {
    const t = req.resourceType();
    if (t === "document" || t === "xhr" || t === "fetch") req.continue();
    else req.abort();
  });

  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen",
    { waitUntil: "domcontentloaded" }
  );

  const rows = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll("table"));
    // pick the visible one
    const visible = tables.find(t => {
      const s = window.getComputedStyle(t);
      const r = t.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && r.width>0 && r.height>0;
    });
    if (!visible) return [];

    return Array.from(visible.querySelectorAll("tbody tr")).map(tr => {
      const cells = Array.from(tr.querySelectorAll("td")).map(td=>td.textContent.trim());
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

  await page.close();
  return rows;
}


/** Scrape the game list (date/time/score) from the static HTML */
export async function fetchLeibenGamePlan() {
  const html = await fetchHTML(GAMES)
  const $    = load(html)

  const games = $('.widget-list.spiele .widget-list_container')
    .map((_, node) => {
      const lg = $(node).find('.widget-match_date--lg')
      let date = '', time = ''
      if (lg.length) {
        date = lg.clone().children().remove().end().text().trim()
        time = lg.find('.widget-large').text().trim()
      } else {
        const sm = $(node).find('.widget-match_date--small').text().trim().split(' ')
        date = sm.slice(0,2).join(' ')
        time = sm[2]||''
      }

      const competition = $(node).find('.widget-match_competition').text().trim()
      const home        = $(node).find('.widget-match_home-team').text().trim()
      const away        = $(node).find('.widget-match_other-team').text().trim()
      const leftScore   = $(node).find('.widget-scores_left').text().trim()
      const rightScore  = $(node).find('.widget-scores_right').text().trim()
      const score       = leftScore && rightScore ? `${leftScore}:${rightScore}` : ''

      return { date, time, competition, home, away, score }
    })
    .get()

  console.log(`✅ Scraped ${games.length} game entries`)
  return games
}
