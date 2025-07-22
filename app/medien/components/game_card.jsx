import Image from "next/image";
import React from "react";

const Game_card = ({ game }) => {
    return (
        <div className=" transition-transform duration-200 hover:scale-105 cursor-pointer" onClick={() => {window.location.href = `/medien/${game.game_id}`;}}>
        <div className="relative w-[250px] h-[100px] justify-center align-middle">
            <Image src="/background.png" fill sizes="250px" style={{ borderStartStartRadius: "8px", borderTopRightRadius: "8px",boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }} alt="Background" />
           {game && <Image
                src={game.homeLogo ? game.homeLogo : "/not_existing.png"}
                alt="Heim-Logo"
                width={64}
                height={64}
                className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            />}
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">:</p>

             {game && <Image
                src={game.awayLogo ? game.awayLogo : "/not_existing.png"}
                alt="Auswärts-Logo"
                width={64}
                height={64}
                className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2"
            />}
        </div>
        <div className="w-[250px] bg-[#0a0a0a] flex items-center p-1" style={{borderBottomLeftRadius:"8px", borderBottomRightRadius:"8px"}}>
            <p className="text-center w-1/2 overflow-hidden whitespace-nowrap px-3 text-lg">{game.game.home}</p>
            <p className="text-center w-1/2 overflow-hidden whitespace-nowrap px-3 text-lg">{game.game.away}</p>
         </div>
        </div>
    );
};

export default Game_card;
