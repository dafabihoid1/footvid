// lib/scraper.js
import axios from 'axios'
import { load } from 'cheerio'

const BASE  = 'https://vereine.oefb.at'
const TABLE = `${BASE}/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen`
const GAMES = `${BASE}/LeibenSv/Mannschaften/Saison-2024-25/KM/Spiele`

async function fetchHTML(url) {
  const res = await axios.get(url, {
    headers: {
      // pretend to be Chrome so they serve the full table
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/114.0.0.0 Safari/537.36'
    },
    timeout: 15000,
  })
  return res.data
}

/** Scrape the “Gesamt” standings table from the static HTML */
export async function fetchLeibenTable() {
  const html = await fetchHTML(TABLE)
  const $    = load(html)

  // The first <table> on the page is the Gesamt table
  const table = $('table').first()
  if (!table.length) return []

  const rows = table
    .find('tbody tr')
    .map((_, tr) => {
      const cells = $(tr)
        .find('td')
        .map((__, td) => $(td).text().trim())
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

  console.log(`✅ Scraped ${rows.length} table rows`)
  return rows
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
