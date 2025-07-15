"use client";
import React from "react";
import Navbar from "../../components/Navbar";
import { getGamePlan, getTeamLogos } from "../actions/actions";
import useServerAction from "../hooks/useServerAction";
import Image from "next/image";

const Medien = () => {
    const {
        data: teamLogos,
        isLoading: teamLogosLoading,
        error: teamLogosError,
        mutate: mutateTeamLogos,
    } = useServerAction("medien-teamLogos", getTeamLogos);
    
    const {
        data: gameplan,
        isLoading: gameplanLoading,
        error: gameplanError,
        mutate: mutateGameplan,
    } = useServerAction("medien-gameplan", getGamePlan);
    

    const mediaGameplan = Array.isArray(gameplan)
        ? gameplan.filter((game) => game.team === "KM" && new Date(game.date) <= new Date())
        : [];

    

    return (
        <>
            <Navbar />
            {/* Mobile View */}
            <main className="container lg:hidden"></main>
            {/* Desktop View */}
            <main className="container hidden bg-card p-4 rounded lg:block">
                
            </main>
        </>
    );
};

export default Medien;
