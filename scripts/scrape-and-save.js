import { fetchLeibenTable, fetchLeibenGamePlan } from "../lib/scraper.js";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

async function main() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { error: clearTabelleError } = await supabase.from("tabelle").delete().gt("id", 0);
    if (clearTabelleError) throw clearTabelleError;

  const { error: clearGamePlanError } = await supabase.from("spielplan").delete().gt("id", 0);
    if (clearGamePlanError) throw clearGamePlanError;

    const rowsTable = await fetchLeibenTable();
    for (const entry of rowsTable) {
        const { error: insertError } = await supabase.from("tabelle").insert([entry]);
        if (insertError) throw insertError;
    }
    const rowsGamePlan = await fetchLeibenGamePlan();
    for (const entry of rowsGamePlan) {
        const { error: insertError } = await supabase.from("spielplan").insert([entry]);
        if (insertError) throw insertError;
    }

    console.log(`✅ Scraped & saved ${rowsTable.length} table rowsTable`);
    console.log(`✅ Scraped & saved ${rowsGamePlan.length} table rowsGamePlan`);
}

main().catch((err) => {
    console.error("❌ Scrape job failed:", err);
    process.exit(1);
});
