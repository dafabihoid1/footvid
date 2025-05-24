import { firefox } from 'playwright';

export async function fetchLeibenTable() {
  // 1) launch headless Firefox (no sandbox needed)
  const browser = await firefox.launch();
  const page    = await browser.newPage();

  // 2) speed-up by blocking images/fonts
  await page.route('**/*', (route) => {
    const t = route.request().resourceType();
    if (t === 'document' || t === 'xhr' || t === 'fetch') route.continue();
    else route.abort();
  });

  // 3) navigate and wait for the table
  await page.goto(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen',
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForSelector('table');  // ensure it’s in the DOM
  //
  // 4) scrape the *first* table (the Gesamt standings)
  const rows = await page.$$eval('table:first-of-type tbody tr', (trs) =>
    trs.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.trim());
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
    })
  );

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
