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
export async function getGamePlan() {
    const { data, error } = await supabase.from("spielplan").select("*").order("date", { ascending: true });

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

export async function register(data) {
    const cookieStore = await cookies();

    const supabase = createServerActionClient({ cookies: () => cookieStore });

    const { data: res, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    const userId = res.user.id;

    const { error: usersError } = await supabase.schema("public").from("users").insert({
        id: userId,
        firstname: data.firstname,
        lastname: data.lastname,
    });

    if (authError) {
        return { authError };
    }
    if (usersError) {
        return { usersError };
    }

    return { user: res.user, session: res.session };
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

export async function getTeamLogos() {
    const { data, error } = await supabase.storage.from("logos").list();

    if (error) {
        console.error("Error fetching logos:", error);
        return [];
    }

    return data
        .filter(file => file.name) // Filter out folders
        .map(file => {
            const { data: urlData } = supabase.storage.from("logos").getPublicUrl(file.name);
            return {
                name: file.name,
                url: urlData.publicUrl,
            };
        });
}

export async function getMedienEntries() {
    const { data, error } = await supabase
        .from("medien")
        .select(`
            *,
            game:game_id (*)
        `);

    if (error) {
        console.error("Error fetching medien with spielplan:", error);
        return [];
    }

    return data;
}