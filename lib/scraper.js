// lib/scraper.js
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteerDev from "puppeteer";

const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";
let _browser = null;

async function launchBrowser() {
  if (_browser) return _browser;

  if (isProd) {
    _browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    _browser = await puppeteerDev.launch({ headless: true });
  }

  return _browser;
}

export async function fetchLeibenTable() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();

  // Only allow document/XHR resources (speedup)
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

  // scrape only the visible table
  const rows = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll("table"));
    // find the one actually displayed
    const visible = tables.find((t) => {
      const style = window.getComputedStyle(t);
      const r     = t.getBoundingClientRect();
      return (
        style.display    !== "none" &&
        style.visibility !== "hidden" &&
        r.width  > 0 &&
        r.height > 0
      );
    });
    if (!visible) return [];

    return Array.from(visible.querySelectorAll("tbody tr")).map(tr => {
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

  await page.close();
  return rows;
}

export async function fetchLeibenGamePlan() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();

  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Spiele",
    { waitUntil: "networkidle0" }
  );

  const games = await page.$$eval(
    ".widget-list.spiele .widget-list_container",
    containers => containers.map(node => {
      // large date block
      const lg = node.querySelector(".widget-match_date--lg");
      let date = "", time = "";
      if (lg) {
        date = lg.childNodes[0].textContent.trim();
        time = lg.querySelector(".widget-large")?.textContent.trim() || "";
      } else {
        const sm = node.querySelector(".widget-match_date--small")?.textContent.trim().split(" ");
        date = sm?.slice(0,2).join(" ") || "";
        time = sm?.[2] || "";
      }
      const competition = node.querySelector(".widget-match_competition")?.textContent.trim() || "";
      const home        = node.querySelector(".widget-match_home-team")?.textContent.trim() || "";
      const away        = node.querySelector(".widget-match_other-team")?.textContent.trim() || "";
      const leftScore   = node.querySelector(".widget-scores_left")?.textContent.trim() || "";
      const rightScore  = node.querySelector(".widget-scores_right")?.textContent.trim() || "";
      const score       = leftScore && rightScore ? `${leftScore}:${rightScore}` : "";

      return { date, time, competition, home, away, score };
    })
  );

  await page.close();
  return games;
}
