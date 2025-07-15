import React from 'react'

const Game_card = () => {

    const game_data = {
        home: "Sv Leiben",
        away: "Tsv Nöchling",
        score: "3:2",
        home_icon: "svleiben_logo.png",
        away_icon: "tsvnöchling_logo.png"
    }
  return (
   <div className="relative w-[200px] h-[100px] justify-center align-middle">
                    <Image src="/background.png" fill style={{ borderRadius: "12px" }} alt="Background" />
                    {teamLogos && (
                        <Image
                            src={teamLogos}
                            alt="Leiben Logo"
                            width={64}
                            height={64}
                            className="absolute top-1/2 left-1/8 transform -translate-x-1/8 -translate-y-1/2"
                        />
                        
                    )}
                    <p  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">:</p>
                </div>
  )
}

export default Game_card