
'use server'
import { fetchLeibenGamePlan, fetchLeibenTable } from "@/lib/scraper.js"
import { supabase } from "../../lib/supabaseClient.js"
import { redirect } from 'next/navigation'; 
import { revalidatePath } from 'next/cache'
import { createServerActionClient }    from '@supabase/auth-helpers-nextjs';
import { cookies }  from 'next/headers';

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

export async function login(data) {
  // Create a Supabase client in the context of a server action
  const supabase = createServerActionClient({ cookies });
  const email    = data.email;
  const password = data.password;
  // Perform sign-in; this will emit the Set-Cookie header
  const { data:res, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error;
  }
  
  return res;
}

export async function logout() {
  // Instantiate Supabase on the server, wired to Next’s cookies
  const supabase = createServerActionClient({ cookies });

  // This will clear the HTTP-only auth cookie AND client session
  const { error } = await supabase.auth.signOut();

  if (error) {
    // Bubble up to the client for error handling
    throw new Error(error.message);
  }

  // Optionally return something to the client, e.g. true
  return true;
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


