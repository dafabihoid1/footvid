import { fetchLeibenTable, fetchLeibenGamePlan } from "../lib/scraper.js";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

async function main() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log("⏳ Scraping tabelle...");
    const rowsTable = await fetchLeibenTable();

    // Upsert Tabelle
    const { error: upsertTabelleError } = await supabase
        .from("tabelle")
        .upsert(rowsTable, { onConflict: ["Mannschaft", "Team"] });

    if (upsertTabelleError) throw upsertTabelleError;
    console.log(`✅ Upserted ${rowsTable.length} tabelle rows`);

    console.log("⏳ Scraping spielplan...");
    const rowsGamePlan = await fetchLeibenGamePlan();

    for (const entry of rowsGamePlan) {
        const { data: existingMatch, error: fetchError } = await supabase
            .from("spielplan")
            .select("*")
            .match({
                home: entry.home,
                away: entry.away,
                competition: entry.competition,
                original_date: entry.original_date,
                team: entry.team
            })
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            // code PGRST116 means "no rows found"
            throw fetchError;
        }

        if (existingMatch) {
            const updates = {};

            if (existingMatch.scheduled_date !== entry.scheduled_date) {
                updates.scheduled_date = entry.scheduled_date;
                updates.was_rescheduled = true;
                updates.rescheduled_at = new Date().toISOString();
            }

            if (existingMatch.time !== entry.time) updates.time = entry.time;
            if (existingMatch.score !== entry.score) updates.score = entry.score;

            if (Object.keys(updates).length > 0) {
                const { error: updateError } = await supabase
                    .from("spielplan")
                    .update(updates)
                    .eq("id", existingMatch.id);

                if (updateError) throw updateError;
                console.log(`🔄 Updated match: ${entry.home} vs ${entry.away} on ${entry.original_date}`);
            }
        } else {
            const { error: insertError } = await supabase
                .from("spielplan")
                .insert([entry]);

            if (insertError) throw insertError;
            console.log(`➕ Inserted new match: ${entry.home} vs ${entry.away} on ${entry.original_date}`);
        }
    }

    console.log(`✅ Processed ${rowsGamePlan.length} spielplan entries`);
}

main().catch((err) => {
    console.error("❌ Scrape job failed:", err);
    process.exit(1);
});