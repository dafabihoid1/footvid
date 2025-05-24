// scraper.js
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteerDev from "puppeteer";

// Detect whether we're running in Vercel (or NODE_ENV=production)
const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";

// Helper to launch Chrome/Chromium appropriately
async function launchBrowser() {
  if (isProd) {
    // Vercel / production: use the sparticuz binary
    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Local development (Windows/macOS): use full puppeteer
    return await puppeteerDev.launch({ headless: true });
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
    const tables  = Array.from(document.querySelectorAll("table"));
    const visible = tables.find((t) => {
      const style = window.getComputedStyle(t);
      const rect  = t.getBoundingClientRect();
      return (
        style.display    !== "none" &&
        style.visibility !== "hidden" &&
        rect.width  > 0 &&
        rect.height > 0
      );
    });
    if (!visible) return [];

    return Array.from(visible.querySelectorAll("tbody tr")).map((tr) => {
      const cells = Array.from(tr.querySelectorAll("td")).map((td) =>
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
    (containers) =>
      containers.map((node) => {
        let dateText = "", timeText = "";
        const lgDate = node.querySelector(".widget-match_date--lg");
        if (lgDate) {
          dateText = lgDate.childNodes[0].textContent.trim();
          timeText = lgDate.querySelector(".widget-large")?.textContent.trim() || "";
        } else {
          const sm    = node.querySelector(".widget-match_date--small");
          const parts = sm?.textContent.trim().split(" ") || [];
          dateText = parts.slice(0, 2).join(" ");
          timeText = parts[2] || "";
        }

        const competition = node
          .querySelector(".widget-match_competition")
          ?.textContent.trim() || "";
        const home       = node
          .querySelector(".widget-match_home-team")
          ?.textContent.trim() || "";
        const away       = node
          .querySelector(".widget-match_other-team")
          ?.textContent.trim() || "";
        const leftScore  = node
          .querySelector(".widget-scores_left")
          ?.textContent.trim() || "";
        const rightScore = node
          .querySelector(".widget-scores_right")
          ?.textContent.trim() || "";
        const score      = leftScore && rightScore ? `${leftScore}:${rightScore}` : "";

        return {
          date:        dateText,
          time:        timeText,
          competition,
          home,
          away,
          score,
        };
      })
  );

  await browser.close();
  return games;
}

// Example local test:
// fetchLeibenTable().then(console.log).catch(console.error);
// fetchLeibenGamePlan().then(console.log).catch(console.error);
