// lib/scraper.js
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteerDev from "puppeteer";
import axios from 'axios'

const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";
let _browser = null;

async function launchBrowser() {
  if (_browser) return _browser;

  if (isProd) {
    _browser = await puppeteerCore.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
        "--no-first-run",
      ],
    });
  } else {
    _browser = await puppeteerDev.launch({ headless: true });
  }

  return _browser;
}

export async function fetchLeibenTable() {
  // 1) Fetch HTML with a browser-like User-Agent
  const { data: html } = await axios.get(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/114.0.0.0 Safari/537.36'
      }
    }
  )

  // 2) Load into Cheerio
  const $ = load(html)

  // 3) Grab the very first table (the “Gesamt” view)
  const table = $('table').first()
  if (!table.length) {
    console.error('⚠️  No <table> found in the fetched HTML (length:', html.length, ')')
    return []
  }

  // 4) Extract rows
  const rows = table
    .find('tbody tr')
    .map((i, tr) => {
      const cells = $(tr)
        .find('td')
        .map((j, td) => $(td).text().trim())
        .get()

      return {
        Rang:           cells[0] || null,
        Mannschaft:     cells[3] || null,
        Spiele:         cells[4] || null,
        Siege:          cells[6] || null,
        Unentschieden:  cells[7] || null,
        Niederlagen:    cells[8] || null,
        Torverhaeltnis: cells[10]|| null,
        Tordifferenz:   cells[11]|| null,
        Punkte:         cells[12]|| null,
      }
    })
    .get()

  console.log(`✅ Scraped ${rows.length} rows from Gesamt table`)
  return rows
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
        const home = node
          .querySelector(".widget-match_home-team")
          ?.textContent.trim() || "";
        const away = node
          .querySelector(".widget-match_other-team")
          ?.textContent.trim() || "";
        const leftScore = node
          .querySelector(".widget-scores_left")
          ?.textContent.trim() || "";
        const rightScore = node
          .querySelector(".widget-scores_right")
          ?.textContent.trim() || "";
        const score =
          leftScore && rightScore ? `${leftScore}:${rightScore}` : "";

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
