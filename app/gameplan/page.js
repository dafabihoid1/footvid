"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar";
import Gameplan_Card from "@/components/ui/gameplan_card";
import Gameplan_Card_Mobile from "@/components/ui/gameplan_card_mobile";
import useServerAction from "../hooks/useServerAction";
import { getGamePlan } from "../actions/actions";
import Loader from "@/components/ui/loader";

export default function GamePlan_Page() {
  const { data: games = [], error, isLoading } = useServerAction("gameplan", getGamePlan);
  
  if (error) return <p className="text-red-600">Error loading games</p>;
  
  const mobileListRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  
// sort all games by date ascending
  const now = new Date();
  const allGames = games
    .map((g) => ({ ...g, dateObj: new Date(g.date) }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const upcomingAll = allGames.filter(g => g.dateObj >= now);
const playedAll   = allGames.filter(g => g.dateObj <  now).reverse();

// Only show first 5 unless toggled
const upcoming = showAllUpcoming ? upcomingAll : upcomingAll.slice(0, 5);
const played   = showAll      ? playedAll   : playedAll.slice(0, 5);

  // For mobile: show oldest first, scroll to bottom for newest
  const mobileGames = [...allGames];

  useEffect(() => {
    const container = mobileListRef.current;
    if (container && container.children.length > 0) {
      const last = container.children[container.children.length - 1];
      last.scrollIntoView({ block: "start" });
    }
  }, [games]);

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
                  h-[calc(100vh-6rem)]
                  overflow-y-auto overscroll-contain
                "
              >
                {/* Sticky header */}
                <div className="sticky top-0 z-10 bg-card border-b border-border p-3 text-center">
                  <h1 className="text-2xl font-semibold">KM Spielplan</h1>
                </div>

                {/* List of games */}
                <div ref={mobileListRef} className="p-3 space-y-3">
                  {mobileGames.map((game, i) => (
                    <Gameplan_Card_Mobile key={i} {...game} />
                  ))}
                  {mobileGames.length === 0 && (
                    <p className="text-center">Keine Spiele verfügbar</p>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <h1 className="text-3xl text-center mb-6">KM Spielplan</h1>
              <div className="grid grid-cols-[1fr_1px_1fr] gap-6">
                {/* Upcoming */}
              <section className="space-y-4">
  <div className="grid grid-cols-3 items-center">
    <div />
    <h2 className="text-xl text-center  whitespace-nowrap">Kommende Spiele</h2>
    {upcomingAll.length > 5 && (
      <button
        onClick={() => setShowAllUpcoming(v => !v)}
        className="text-sm text-primary underline justify-self-end"
      >
        {showAllUpcoming ? "5 Spiele" : "Alle Spiele"}
      </button>
    )}
  </div>
  {upcoming.map((g,i) => <Gameplan_Card key={i} {...g} />)}
</section>

                <div className="bg-border" />

                {/* Played */}
               <section className="space-y-4">
  <div className="grid grid-cols-3 items-center">
    <div />
    <h2 className="text-xl text-center  whitespace-nowrap">Letzte Spiele</h2>
    {playedAll.length > 5 && (
      <button
        onClick={() => setShowAll(v => !v)}
        className="text-sm text-primary underline justify-self-end"
      >
        {showAll ? "5 Spiele" : "Alle Spiele"}
      </button>
    )}
  </div>
  {played.map((g,i) => <Gameplan_Card key={i} {...g} />)}
</section>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
