"use client";
import React from "react";
import { getTabelle, scrapeTableData } from "../actions/actions.js";
import Navbar from "../Navbar.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import CustomLoader from "@/components/ui/loader.jsx";
import useServerAction from "../hooks/useServerAction.js";

// force this page to re-render on every request
export const dynamic = "force-dynamic";

export default function TablePage() {
    // const [tabelle, setTabelle] = React.useState(null);

    const { data: tabelle, isLoading: tabelleLoading, error: tabelleError, mutate: mutateTabelle} = useServerAction("TableData", getTabelle);

 
    return (
        <>
            <Navbar></Navbar>
            <main>
              {tabelleLoading == true && <CustomLoader/>}
              {tabelleLoading == false && 
                <div className="md:rounded-md overflow-hidden shadow-sm animate-fade-in-up">
                    <Table className="w-full">
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
                </div>}
            </main>
        </>
    );
}
