import { getMediaGameById } from "@/app/actions/actions";
import Image from "next/image";
import React from "react";

export default async function MediaGame({ params }) {
    const { game_id } = params;
    const game = await getMediaGameById(game_id);

    console.log(game);

    return <div>MediaGame - Game ID: {game_id}<Image width={150} height={150} src={game.photos[0]}></Image></div>;
}
