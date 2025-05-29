import React from "react";
import { Card, CardContent} from "./card";

export default function Gameplan_Card({ date, time, competition, home, away, score }) {
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
            <Card className={`border border-border rounded-lg overflow-hidden ${bgClass}`}>
                <CardContent className="p-2 md:p-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex items-center justify-between md:flex-col md:items-start w-full md:w-auto">
                            <div className="text-sm font-semibold text-foreground">{date}</div>
                            <div className="text-xs text-muted-foreground">{time}</div>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
                            <span
                                className={`text-sm md:text-lg ${
                                    home.toLowerCase().includes("leiben") ? "font-bold" : ""
                                }`}
                            >
                                {home}
                            </span>
                            <span className="text-lg md:text-2xl font-bold text-primary">{score || "-"}</span>
                            <span
                                className={`text-sm md:text-lg ${
                                    away.toLowerCase().includes("leiben") ? "font-bold" : ""
                                }`}
                            >
                                {away}
                            </span>
                        </div>

                        <div className="text-xs uppercase tracking-wide font-semibold text-primary hidden md:block">
                            {competition}
                        </div>
                    </div>
                    <div className="mt-2 md:hidden text-xs uppercase tracking-wide font-semibold text-primary text-center">
                        {competition}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
