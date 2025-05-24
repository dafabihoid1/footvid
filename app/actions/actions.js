export const runtime = 'nodejs';
'use server'
import { fetchLeibenGamePlan, fetchLeibenTable } from "@/lib/scraper.js"
import { supabase } from "../../lib/supabaseClient.js"

export async function getTabelle() {
  const { data, error } = await supabase
    .from('tabelle')
    .select('*')               // fetch all columns
    .order('Rang', { ascending: true })  // optional: order by "rang" asc

  if (error) {
    console.error('Error fetching tabelle:', error)
    return []
  }

  return data
}

export async function insertTabelle(entry) {
  const { data, error } = await supabase
    .from('tabelle')
    .insert([ entry ])        // wrap your entry in an array

  if (error) {
    console.error('Error inserting into tabelle:', error)
    throw error
  }

  return data             
}

export async function clearTabelle() {
  // We filter id > 0 so that delete() will apply to every row.
  const { data, error } = await supabase
    .from('tabelle')
    .delete()
    .gt('id', 0)

  if (error) {
    console.error('Error clearing tabelle:', error)
    throw error
  }

  return data
}

export async function scrapeTableData() {
 
  const rows = await fetchLeibenTable();

  return rows;
}

export async function scrapeGamePlanData() {
 
  const rows = await fetchLeibenGamePlan();

  return rows;
}