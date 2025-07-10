"use client";
import React, { useState } from "react";
import { getTabelle, scrapeTableData } from "../actions/actions.js";
import Navbar from "../../components/Navbar.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import Loader from "@/components/ui/loader.jsx";
import useServerAction from "../hooks/useServerAction.js";
import { formatUpdatedAt } from "@/lib/utils.js";
import { Card } from "@/components/ui/card.jsx";

// force this page to re-render on every request
export const dynamic = "force-dynamic";

export default function TablePage() {
    // const [tabelle, setTabelle] = React.useState(null);
    const [activeTeam, setActiveTeam] = useState("KM");
    const [teamMenuOpen, setTeamMenuOpen] = useState(false);
    
    const {
        data: tabelle,
        isLoading: tabelleLoading,
        error: tabelleError,
        mutate: mutateTabelle,
    } = useServerAction("TableData", getTabelle);

    return (
        <>
            <Navbar></Navbar>
            <main>
                {tabelleLoading == true && <Loader />}
                {tabelleLoading == false && (
                    <>
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
                                                    setActiveTeam("RES");
                                                    setTeamMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                RES Spielplan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="overflow-hidden bg-primary-foreground animate-fade-in-up">
                            <Table className="w-full mb-0 !rounded-md">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Mannschaft</TableHead>
                                        <TableHead>Spiele</TableHead>
                                        <TableHead className="hidden sm:table-cell">S</TableHead>
                                        <TableHead className="hidden sm:table-cell">U</TableHead>
                                        <TableHead className="hidden sm:table-cell">N</TableHead>
                                        <TableHead>Torverh.</TableHead>
                                        <TableHead className="hidden sm:table-cell">+/-</TableHead>
                                        <TableHead>Punkte</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tabelle?.map((row) => (
                                        <TableRow
                                            key={row.Rang}
                                            className={row.Mannschaft === "Leiben" ? "bg-[#003d11]  font-semibold" : ""}
                                        >
                                            <TableCell>{row.Rang}</TableCell>
                                            <TableCell>{row.Mannschaft}</TableCell>
                                            <TableCell>{row.Spiele}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{row.Siege}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{row.Unentschieden}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{row.Niederlagen}</TableCell>
                                            <TableCell>{row.Torverhaeltnis}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{row.Tordifferenz}</TableCell>
                                            <TableCell>{row.Punkte}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 pr-2 text-muted-foreground flex justify-end">
                                {formatUpdatedAt(tabelle[0].updated_at)}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
