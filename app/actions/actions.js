"use server";
import { fetchLeibenGamePlan, fetchLeibenTable } from "@/lib/scraper.js";
import { supabase } from "../../lib/supabaseClient.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getTabelle() {
    const { data, error } = await supabase
        .from("tabelle")
        .select("*") // fetch all columns
        .order("Rang", { ascending: true }); // optional: order by "rang" asc

    if (error) {
        console.error("Error fetching tabelle:", error);
        return [];
    }

    return data;
}

export async function insertTabelle(entry) {
    const { data, error } = await supabase.from("tabelle").insert([entry]); // wrap your entry in an array

    if (error) {
        console.error("Error inserting into tabelle:", error);
        throw error;
    }

    return data;
}

export async function login(data) {
    const cookieStore = await cookies();

    const supabase = createServerActionClient({ cookies: () => cookieStore });
    const email = data.email;
    const password = data.password;

    const { data: res, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return error;
    }

    return res;
}

export async function logout() {
    const cookieStore = await cookies();
    const supabase = createServerActionClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function clearTabelle() {
    const { data, error } = await supabase.from("tabelle").delete().gt("id", 0);

    if (error) {
        console.error("Error clearing tabelle:", error);
        throw error;
    }

    return data;
}
