import { fetchLeibenTable, fetchLeibenGamePlan } from '../lib/scraper.js'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1) Clear the old table
  const { error: clearError } = await supabase
    .from('tabelle')
    .delete()
    .gt('id', 0)
  if (clearError) throw clearError

  // 2) Fetch new table data
  const rows = await fetchLeibenTable()
console.log(rows);
  // 3) Insert into Supabase
  for (const entry of rows) {
    const { error: insertError } = await supabase
      .from('tabelle')
      .insert([entry])
    if (insertError) throw insertError
  }

  console.log(`✅ Scraped & saved ${rows.length} table rows`)
}

main().catch(err => {
  console.error('❌ Scrape job failed:', err)
  process.exit(1)
})
