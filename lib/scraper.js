import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";

async function launchBrowser() {
  if (isProd) {
    // on Vercel: use the downloaded chromium
    return puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // local dev: use your system Chrome
    return puppeteer.launch({
      channel: "chrome",
      headless: true,
    });
  }
}

export async function fetchLeibenTable() {
  const browser = await launchBrowser();
  const page    = await browser.newPage();
  await page.goto(
    "https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen",
    { waitUntil: "networkidle0" }
  );

  // wait for the Gesamt ("NORMAL") table to render
  await page.waitForSelector("section.app-vhp3_tabelle table.widget-table");

  const rows = await page.evaluate(() => {
    const table = document.querySelector(
      "section.app-vhp3_tabelle table.widget-table"
    );
    if (!table) return [];

    return Array.from(table.tBodies[0].rows).map(tr => {
      const cells = Array.from(tr.cells).map(td => td.textContent.trim());
      return {
        Rang:           cells[0],
        Mannschaft:     cells[2],
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
    containers =>
      containers.map(node => {
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

        return { date: dateText, time: timeText, competition, home, away, score };
      })
  );

  await browser.close();
  return games;
}