import React from "react";

export default function Gameplan_Card_Mobile({ date, time, competition, home, away, score }) {
    let bgClass = "bg-card";
    if (score) {
        const [left, right] = score.split(":").map(Number);
        const isHomeLeiben = home.toLowerCase().includes("leiben");
        const leibenGoals = isHomeLeiben ? left : right;
        const opponentGoals = isHomeLeiben ? right : left;

        if (leibenGoals > opponentGoals) {
            bgClass = "bg-card ring-1 ring-leibengreen";
        } else if (leibenGoals < opponentGoals) {
            bgClass = "bg-card ring-1 ring-[#a30001]";
        }
    }

    const DateObj = new Date(date);
    const [h, m, s] = time.split(":").map(Number);

    return (
        <>
            <div className={`block lg:hidden px-3 py-1 border border-border rounded-lg  ${bgClass}`}>
                <p className="text-xs py-1 text-center">
                    {DateObj.toLocaleDateString("de-AT", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                    })}
                    , {`${h}:${m.toString().padStart(2, "0")}`}
                </p>
                <div className="grid grid-cols-3">
                    <p className={`text-l text-center truncate ${home.toLowerCase().includes("leiben") ? "font-bold" : ""}`}>
                        <span className="flex-1 text-sm truncate whitespace-nowrap">{home}</span>
                    </p>
                    <p className="text-xl text-center ">{score}</p>
                    <p className={`text-l text-center ${away.toLowerCase().includes("leiben") ? "font-bold" : ""}`}>
                        <span className="flex-1 text-sm truncate whitespace-nowrap">{away}</span>
                    </p>
                </div>
            </div>
        </>
    );
}
