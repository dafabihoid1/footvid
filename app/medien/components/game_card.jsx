import Image from "next/image";
import React from "react";

const Game_card = ({ game }) => {
    console.log(game);
    return (
        <div className="relative w-[200px] h-[100px] justify-center align-middle">
            <Image src="/background.png" fill style={{ borderRadius: "12px" }} alt="Background" />
           {game && <Image
                src={game.homeLogo ? game.homeLogo : "/not_existing.png"}
                alt="Heim-Logo"
                width={64}
                height={64}
                className="absolute top-1/2 left-1/8 transform -translate-x-1/8 -translate-y-1/2"
            />}
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">:</p>

             {game && <Image
                src={game.awayLogo ? game.awayLogo : "/not_existing.png"}
                alt="Auswärts-Logo"
                width={64}
                height={64}
                className="absolute top-1/2 left-7/8 transform -translate-x-7/8 -translate-y-1/2"
            />}
        </div>
    );
};

export default Game_card;
