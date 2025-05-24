// scripts/scrape-and-save.js
import { fetchLeibenTable, fetchLeibenGamePlan } from "../lib/scraper.js";
import { clearTabelle, insertTabelle }        from "../lib/db-actions.js";  // your supabase actions

async function main() {
  try {
    console.log("⏳ Clearing old table…");
    await clearTabelle();

    console.log("⏳ Fetching standings…");
    const tableRows = await fetchLeibenTable();
    console.log(`✅ Got ${tableRows.length} rows, inserting…`);
    for (const row of tableRows) {
      await insertTabelle(row);
    }

    console.log("⏳ Fetching game plan…");
    const games = await fetchLeibenGamePlan();
    console.log("✅ Games:", games);

    console.log("🎉 All done!");
  } catch (err) {
    console.error("❌ Scrape job failed:", err);
    process.exit(1);
  }
}

main();
