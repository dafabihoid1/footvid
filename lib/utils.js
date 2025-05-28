import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatUpdatedAt(isoString) {
  const date = new Date(isoString)
  const now  = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffH  = Math.floor(diffMs / 3_600_000) // ms→hours

 
  if (diffH <= 1) {
    return 'zuletzt aktualisiert: vor einer Stunde'
  }
  if (diffH < 24) {
    return `zuletzt aktualisiert: vor ${diffH} Stunden`
  }

  const day = date.toLocaleDateString('de-AT', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  })
  const hour = date.getHours().toString().padStart(2, '0')
  return `Stand: ${day}, ${hour} Uhr`
}