import axios from 'axios'
import { load } from 'cheerio'

export async function fetchLeibenTable() {
  const { data: html } = await axios.get(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Tabellen'
  )
  const $ = load(html)

  // find the visible table
  const table = $('table').filter((i, el) => {
    const style = $(el).attr('style') || ''
    return !/display:\s*none/.test(style)
  }).first()

  return table
    .find('tbody tr')
    .map((i, tr) => {
      const cells = $(tr)
        .find('td')
        .map((j, td) => $(td).text().trim())
        .get()

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
    .get()
}

export async function fetchLeibenGamePlan() {
  const { data: html } = await axios.get(
    'https://vereine.oefb.at/LeibenSv/Mannschaften/Saison-2024-25/KM/Spiele'
  )
  const $ = load(html)

  return $('.widget-list.spiele .widget-list_container')
    .map((i, node) => {
      const lgDate = $(node).find('.widget-match_date--lg')
      let date = '', time = ''
      if (lgDate.length) {
        date = lgDate.clone().children().remove().end().text().trim()
        time = lgDate.find('.widget-large').text().trim()
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
}