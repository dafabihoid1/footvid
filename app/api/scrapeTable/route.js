export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { fetchLeibenTable } from '@/lib/scraper'

export async function GET() {
  const rows = await fetchLeibenTable()
  return NextResponse.json(rows)
}