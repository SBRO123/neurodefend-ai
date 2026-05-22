import { NextResponse } from 'next/server'
import { DEMO_ALERTS } from '@/lib/demoData'

export async function GET() {
  return NextResponse.json({ alerts: DEMO_ALERTS, count: DEMO_ALERTS.length })
}
