"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import Gameplan_Card from "@/components/ui/gameplan_card";
import Gameplan_Card_Mobile from "@/components/ui/gameplan_card_mobile";
import useServerAction from "../hooks/useServerAction";
import { getGamePlan } from "../actions/actions";
import Loader from "@/components/ui/loader";

export default function GamePlan_Page() {
    const { data: games = [], error, isLoading } = useServerAction("gameplan", getGamePlan);
    const [showAll, setShowAll] = useState(false);
    const [showAllUpcoming, setShowAllUpcoming] = useState(false);
    const [activeTeam, setActiveTeam] = useState("KM");
    const [teamMenuOpen, setTeamMenuOpen] = useState(false);
    const mobileListRef = useRef(null);
    const lastItemRef = useRef(null);

    useEffect(() => {
        if (isLoading || !mobileGames.length) return;

        requestAnimationFrame(() => {
            const lastGameEl = lastItemRef.current;
            if (lastGameEl) {
                lastGameEl.scrollIntoView({ behavior: "auto" });
            }
        });
    }, [games, isLoading, activeTeam]);

    if (error) return <p className="text-red-600">Error loading games</p>;

    const now = new Date();

    const allGames = games
        .filter((g) => {
            return g.team == activeTeam;
        })
        .map((g) => ({ ...g, dateObj: new Date(g.date) }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const upcomingAll = allGames.filter((g) => g.dateObj >= now);
    const playedAll = allGames.filter((g) => g.dateObj < now).reverse();
    const upcoming = showAllUpcoming ? upcomingAll : upcomingAll.slice(0, 5);
    const played = showAll ? playedAll : playedAll.slice(0, 5);

    const mobileGames = allGames;
    return (
        <>
            <Navbar />
            <main className="relative md:static container mx-auto p-0 md:p-4">
                {isLoading && <Loader />}

                {!isLoading && (
                    <>
                        {/* Mobile & Tablet View */}
                        <div className="md:hidden">
                            <div
                                className="
                                    flex flex-col
                                    h-[calc(100vh-6rem-4.5rem)]
                                    overflow-y-auto overscroll-contain
                                "
                            >
                                <div className="sticky top-0 z-10 bg-card p-3 flex justify-center items-center">
                                    <div>
                                        <button
                                            onClick={() => setTeamMenuOpen((open) => !open)}
                                            className="inline-flex justify-center w-full px-4 py-2 bg-background-foreground text-md text-foreground hover:bg-gray-50 focus:outline-none"
                                        >
                                            {activeTeam} Spielplan
                                            <svg
                                                className="-mr-1 ml-2 h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>

                                        {teamMenuOpen && (
                                            <div className="w-full text-foreground bg-background-foreground text-center absolute z-10 mt-2 w-36 left-1/2 -translate-x-1/2 rounded-md shadow-lg focus:outline-none">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => {
                                                            setActiveTeam("KM");
                                                            setTeamMenuOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        KM Spielplan
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActiveTeam("Res");
                                                            setTeamMenuOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        Res Spielplan
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* List of games */}
                                <div ref={mobileListRef} className="p-3 pb-40 space-y-3 min-h-[110%]">
                                    {mobileGames.map((game, i) => (
                                        <Gameplan_Card_Mobile key={i} {...game} />
                                    ))}
                                    <div ref={lastItemRef} className="h-5" />
                                    {mobileGames.length === 0 && <p className="text-center">Keine Spiele verfügbar</p>}
                                </div>
                            </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block">
                               <div className="sticky top-0 z-10 p-3 flex justify-center items-center">
                            <div>
                                <button
                                    onClick={() => setTeamMenuOpen((open) => !open)}
                                    className="inline-flex justify-center w-full px-4 py-2 text-md text-foreground"
                                >
                                    {activeTeam} Spielplan
                                    <svg
                                        className="-mr-1 ml-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {teamMenuOpen && (
                                    <div className="text-foreground bg-black text-center absolute z-10 mt-2 w-36 left-1/2 -translate-x-1/2 rounded-md shadow-lg focus:outline-none">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setActiveTeam("KM");
                                                    setTeamMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-500"
                                            >
                                                KM Spielplan
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActiveTeam("Res");
                                                    setTeamMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-500"
                                            >
                                                Res Spielplan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                            <div className="grid grid-cols-[1fr_1px_1fr] gap-6">
                                {/* Upcoming */}
                                <section className="space-y-4">
                                    <div className="grid grid-cols-3 items-center">
                                        <div />
                                        <h2 className="text-xl text-center whitespace-nowrap">Kommende Spiele</h2>
                                        {upcomingAll.length > 5 && (
                                            <button
                                                onClick={() => setShowAllUpcoming((v) => !v)}
                                                className="text-sm text-primary underline justify-self-end"
                                            >
                                                {showAllUpcoming ? "5 Spiele" : "Alle Spiele"}
                                            </button>
                                        )}
                                    </div>
                                    {upcoming.map((g, i) => (
                                        <Gameplan_Card key={i} {...g} />
                                    ))}
                                </section>

                                <div className="bg-border" />

                                {/* Played */}
                                <section className="space-y-4">
                                    <div className="grid grid-cols-3 items-center">
                                        <div />
                                        <h2 className="text-xl text-center whitespace-nowrap">Letzte Spiele</h2>
                                        {playedAll.length > 5 && (
                                            <button
                                                onClick={() => setShowAll((v) => !v)}
                                                className="text-sm text-primary underline justify-self-end"
                                            >
                                                {showAll ? "5 Spiele" : "Alle Spiele"}
                                            </button>
                                        )}
                                    </div>
                                    {played.map((g, i) => (
                                        <Gameplan_Card key={i} {...g} />
                                    ))}
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
