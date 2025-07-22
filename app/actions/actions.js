"use server";
import { fetchLeibenGamePlan, fetchLeibenTable } from "@/lib/scraper.js";
import { supabase } from "../../lib/supabaseClient.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

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
        .filter((file) => file.name) // Filter out folders
        .map((file) => {
            const { data: urlData } = supabase.storage.from("logos").getPublicUrl(file.name);
            return {
                name: file.name,
                url: urlData.publicUrl,
            };
        });
}

export async function getMedienEntries() {
    const { data, error } = await supabase.from("medien").select(`
            *,
            game:game_id (*)
        `);

    if (error) {
        console.error("Error fetching medien with spielplan:", error);
        return [];
    }

    return data;
}

export async function insertMedienGame(game, photos) {
    const result = await supabase.from("medien").insert([
        {
            game_id: game.id,
            photos: photos,
        },
    ]);

    return result;
}

export async function getLoggedInUser() {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Error fetching logged in user:", authError);
        return null;
    }

    // Query your public.users table where id matches auth user's id
    const { data: profile, error: profileError } = await supabase
        .from("users") // assuming public.users
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return null;
    }

    return { ...user, profile };
}

export async function getAvaliableGamesForAddGameDialogDropdown() {
    const { data: usedGames } = await supabase.from("medien").select("game_id");
    const usedGameIds = usedGames.map((m) => m.game_id).filter(Boolean);
    const today = new Date().toISOString().split("T")[0];

    const { data: allGames } = await supabase.from("spielplan").select("*").eq("team", "KM");

    const availableGames = allGames.filter((game) => {
        const gameDate = game.scheduled_date ?? game.original_date;
        return gameDate && gameDate < today && !usedGameIds.includes(game.id);
    });

    return availableGames;
    // Remove duplicates on same date + opponent, preferring KM (currently just KM gets showen, should be updated in the future maybe)
    // const uniqueGamesMap = new Map();

    // availableGames.forEach((game) => {
    //     const gameDate = game.scheduled_date ?? game.original_date;
    //     const opponent = game.away;
    //     const uniqueKey = `${gameDate}_${opponent}`;

    //     const existing = uniqueGamesMap.get(uniqueKey);

    //     if (!existing || existing.team === "Res") {
    //         if (game.team === "KM" || !existing) {
    //             uniqueGamesMap.set(uniqueKey, game);
    //         }
    //     }
    // });
    // return Array.from(uniqueGamesMap.values());
}

export async function getMediaGameById(game_id){
    const { data, error } = await supabase
        .from("medien")
        .select(`
            *,
            game:game_id (*)
        `)
        .eq("game_id", game_id)
        .single();

    if (error) {
        console.error("Error fetching medien with spielplan:", error);
        return null;
    }

    return data;
}