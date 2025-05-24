import puppeteer from 'puppeteer';
//  import { clearTabelle, insertTabelle } from '../app/actions/actions.js'

export async function fetchLeibenTable() {
  const browser = await puppeteer.launch({ headless: true })
  const page    = await browser.newPage()
  await page.goto(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen',
    { waitUntil: 'networkidle0' }
  )

  const rows = await page.evaluate(() => {
    // 1) grab all tables on the page
    const tables = Array.from(document.querySelectorAll('table'))

    // 2) find the one that's actually visible (not display:none, not zero-size)
    const visible = tables.find(t => {
      const style = window.getComputedStyle(t)
      const rect  = t.getBoundingClientRect()
      return (
        style.display    !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width  > 0 &&
        rect.height > 0
      )
    })
    if (!visible) return []

    // 3) extract rows from the visible table only
    return Array.from(visible.querySelectorAll('tbody tr')).map(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td =>
        td.textContent.trim()
      )
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
      }
    })
  })

  await browser.close()
  return rows
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
