import React from 'react'
import {
  Card,
  CardContent,
} from './card'

export default function GameplanCard({
  date,
  time,
  competition,
  home,
  away,
  score,
}) {
  return (
    <Card className="h-[100px] bg-card border border-border rounded-lg overflow-hidden">
      <CardContent className="p-2">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6">
          {/* Left: date & time */}
          <div className="text-sm text-muted-foreground text-right space-y-0.5">
            <div className="font-semibold text-foreground">{date}</div>
            <div>{time}</div>
          </div>

          {/* Center: home — score — away */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-lg font-medium text-foreground">{home}</span>
            <span className="text-2xl font-bold text-primary">{score}</span>
            <span className="text-lg font-medium text-foreground">{away}</span>
          </div>

          {/* Right: competition */}
          <div className="text-xs uppercase tracking-wide font-semibold text-primary">
            {competition}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

