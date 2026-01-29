import { db } from '@/lib/db'
import { settings } from '@/db/schema'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET() {
  const allSettings = await db.select().from(settings)
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
  
  return NextResponse.json(settingsMap)
}
