"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import {
    getAvaliableGamesForAddGameDialogDropdown,
    getGamePlan,
    getLoggedInUser,
    getMedienEntries,
    getTeamLogos,
} from "../actions/actions";
import useServerAction from "../hooks/useServerAction";
import Image from "next/image";
import Game_card from "./components/game_card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AddMediaTeamDialog from "./components/add_game_dialog";
import Loader from "@/components/ui/loader";

const Medien = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filterOrt, setFilterOrt] = useState("all");
    const filterOrtMapping = {
        all: "Alle",
        home: "Heim",
        away: "Auswärts",
    };

    const {
        data: teamLogos,
        isLoading: teamLogosLoading,
        error: teamLogosError,
        mutate: mutateTeamLogos,
    } = useServerAction("medien-teamLogos", getTeamLogos);

    const {
        data: gamesWithMedia,
        isLoading: gamesWithMediaLoading,
        error: gamesWithMediaError,
        mutate: refreshGamesWithMedia,
    } = useServerAction("medien-gamesWithMedia", getMedienEntries);

    const {
        data: loggedInUser,
        isLoading: loggedInUserLoading,
        error: loggedInUserError,
        mutate: refreshLoggedInUser,
    } = useServerAction("medien-loggedInUser", getLoggedInUser);

    const {
        data: availableGames,
        isLoading: availableGamesLoading,
        error: availableGamesError,
        mutate: refreshAvailableGames,
    } = useServerAction("medien-availableGames", getAvaliableGamesForAddGameDialogDropdown);

    const loading = teamLogosLoading || gamesWithMediaLoading || loggedInUserLoading || availableGamesLoading;
    const error = teamLogosError || gamesWithMediaError || loggedInUserError || availableGamesError;

    // import logo into gameWithMedia Object
    if (gamesWithMedia && Array.isArray(gamesWithMedia) && teamLogos && Array.isArray(teamLogos)) {
        gamesWithMedia.forEach((game) => {
            const homeLogo = teamLogos.find(
                (logo) =>
                    logo.name.replace(".png", "").toLowerCase().replace(/ /g, "_") ===
                    String(game.game.home).toLowerCase().replace(/ /g, "_").replace(/_ii$/, "").trim()
            );

            const awayLogo = teamLogos.find(
                (logo) =>
                    logo.name.replace(".png", "").toLowerCase().replace(/ /g, "_") ===
                    String(game.game.away).toLowerCase().replace(/ /g, "_").replace(/_ii$/, "").trim()
            );

            game.homeLogo = homeLogo ? homeLogo.url : null;
            game.awayLogo = awayLogo ? awayLogo.url : null;
        });
    }

    return (
        <>
            <Navbar />
            {loading && <Loader></Loader>}
            {!loading && (
                <>
                    {/* Mobile View */}
                    <main className="container lg:hidden"></main>
                    {/* Desktop View */}
                    <main className="container hidden bg-card p-4 rounded lg:block">
                        <div className="flex justify-between items-center">
                            <h1>Medien</h1>
                            {loggedInUser?.profile.system_role == "Admin" && (
                                <Button onClick={() => setDialogOpen(true)}>Spiel hinzufügen</Button>
                            )}
                        </div>
                        <p className="text-mg text-muted-foreground mb-5">
                            Nur Spiele mit Fotos oder einem Video werden angezeigt!
                        </p>
                        {/* <div className=" border-b-1 border-gray-400 flex mb-5">
                    <Label>Ort: </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button>{filterOrtMapping[filterOrt]}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Ort</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={filterOrt} onValueChange={setFilterOrt}>
                                <DropdownMenuRadioItem value={"all"}>Alle</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value={"home"}>Heim</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value={"away"}>Auswärts</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div> */}

                        <div className="flex flex-wrap space-x-12 space-y-4">
                            {gamesWithMedia &&
                                Array.isArray(gamesWithMedia) &&
                                gamesWithMedia.map((game, idx) => <Game_card key={idx} game={game} />)}
                        </div>
                        <AddMediaTeamDialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            availableGames={availableGames}
                        />
                    </main>
                </>
            )}
        </>
    );
};

export default Medien;
