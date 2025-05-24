import React from "react";
import Navbar from "../Navbar";
import Gameplan_Card from "@/components/ui/gameplan_card";
import { Separator } from '@radix-ui/react-separator'

const GamePlan_Page = () => {
     const fixtures = [
    { date: "Fr. 25.04.", time: "20:00", competition: "Liga", home: "Ybbsitz", away: "Leiben", score: "4:2" },
    { date: "Sa. 26.04.", time: "18:30", competition: "Cup",   home: "X-Team",  away: "Y-Team",  score: "1:3" },
    { date: "So. 27.04.", time: "16:00", competition: "Liga", home: "A-Team",  away: "B-Team",  score: "2:1" },
    { date: "Mo. 28.04.", time: "19:00", competition: "Cup",   home: "C-Team",  away: "D-Team",  score: "0:0" },
  ]

    const half = Math.ceil(fixtures.length / 2)
  const left  = fixtures.slice(0, half)
  const right = fixtures.slice(half)
  return (
    <>
    <Navbar></Navbar>
    <main className="container mx-auto p-4">
       <div
        className="
          grid 
          grid-cols-[1fr_1px_1fr]    /* three tracks: left, divider, right */
          gap-y-6                  
          gap-x-6                  
        "
      >
        <div className="space-y-5">
            <h1 className="text-center text-3xl">KM</h1>
          {left.map((f,i) => (
              <Gameplan_Card key={i} {...f} />
            ))}
        </div>

        <div className="bg-white" />

        <div className="space-y-5">
            <h1 className="text-center text-3xl">U23</h1>
          {right.map((f,i) => (
            <Gameplan_Card key={i} {...f} />
          ))}
        </div>
      </div>
    </main>
        </>
    );
};

export default GamePlan_Page;
