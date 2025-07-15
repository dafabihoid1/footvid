"use client";
import React from "react";
import Navbar from "../../components/Navbar";
import { getGamePlan, getMedienEntries, getTeamLogos } from "../actions/actions";
import useServerAction from "../hooks/useServerAction";
import Image from "next/image";
import Game_card from "./components/game_card";

const Medien = () => {
    const {
        data: teamLogos,
        isLoading: teamLogosLoading,
        error: teamLogosError,
        mutate: mutateTeamLogos,
    } = useServerAction("medien-teamLogos", getTeamLogos);

    // const {
    //     data: gameplan,
    //     isLoading: gameplanLoading,
    //     error: gameplanError,
    //     mutate: mutateGameplan,
    // } = useServerAction("medien-gameplan", getGamePlan);

    const {
        data: test,
        isLoading: test1,
        error: test2,
        mutate: test3,
    } = useServerAction("medien-gameplan11", getMedienEntries);

    // const mediaGameplan = Array.isArray(gameplan)
    //     ? gameplan.filter((game) => game.team === "KM" && new Date(game.date) <= new Date())
    //     : [];

   if (test && Array.isArray(test) && teamLogos && Array.isArray(teamLogos)) {
    test.forEach((game) => {
        const homeLogo = teamLogos.find(
            (logo) =>
                logo.name.replace(".png", "").toLowerCase().replace(/ /g, "_") ===
                String(game.game.home).toLowerCase().replace(/ /g, "_").replace(/_ii$/, "").trim()
        );
        console.log(
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
            {/* Mobile View */}
            <main className="container lg:hidden"></main>
            {/* Desktop View */}
            <main className="container hidden bg-card p-4 rounded lg:block">
                {test && Array.isArray(test) && test.map((game, idx) => <Game_card key={idx} game={game} />)}
            </main>
        </>
    );
};

export default Medien;
