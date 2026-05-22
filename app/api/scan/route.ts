import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/scanner'

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content too long (max 5000 chars)' }, { status: 400 })
    }
    const result = analyzeContent(content.trim())
    return NextResponse.json({ success: true, result })
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
