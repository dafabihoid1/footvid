"use client";
import React from "react";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-6 text-center space-y-4">
        <h1 className="text-4xl font-bold">Willkommen in der Sv Leiben App</h1>
        <p className="text-xl italic text-primary">„Amoi Leibner, imma Leibner“</p>
        <p className="text-xl  text-primary">Zukünftig gibt es hier alle Informationen zur derzeitigen Tabelle, Spielplan, Trainingsplan + alle Medien werder hier in Video und Fotoform festgehalten.</p>
        <p className="text-xl  text-primary">Die Web-App befindet sich derzeit noch im Entwicklungsstadium.</p>
      </main>
    </>
  );
}
