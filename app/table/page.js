"use client";
import React from "react";
import { getTabelle } from "../actions/actions.js";
import Navbar from "../Navbar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table.jsx";
import CustomLoader from "@/components/ui/loader.jsx";
import useServerAction from "../hooks/useServerAction.js";
import { formatUpdatedAt } from "@/lib/utils.js";

export default function TablePage() {
  const {
    data: tabelle,
    isLoading: tabelleLoading,
    error: tabelleError,
    mutate: mutateTabelle,
  } = useServerAction("TableData", getTabelle);

  return (
    <>
      <Navbar />
      <main className="p-4">
        {tabelleLoading && <CustomLoader />}

        {!tabelleLoading && tabelle && (
          <>
            <div className="overflow-auto shadow-sm animate-fade-in-up">
              <Table className="min-w-full divide-y divide-gray-700 dark:divide-gray-600">
                <TableHeader className="bg-gray-800">
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
                  {tabelle.map((row, idx) => (
                    <TableRow
                      key={row.Rang}
                      className={`
                        ${row.Mannschaft === "Leiben" ? "bg-[#003d11] font-semibold" : ""}
                        ${idx % 2 === 0 
                          ? "bg-gray-900 dark:bg-gray-800" 
                          : "bg-gray-800 dark:bg-gray-700"
                        }
                      `}
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
            </div>

            <div className="mt-4 text-right text-sm text-gray-400 dark:text-gray-500">
              Updated: {formatUpdatedAt(tabelle[0].updated_at)}
            </div>
          </>
        )}

        {tabelleError && (
          <div className="text-red-500">Error loading table data.</div>
        )}
      </main>
    </>
  );
}
