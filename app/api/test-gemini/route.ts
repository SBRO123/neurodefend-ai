import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ status: 'missing', message: 'GEMINI_API_KEY is not set in environment variables' })
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with just the word: WORKING' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ status: 'error', message: err?.error?.message || 'API call failed', httpStatus: res.status })
    }

    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

    return NextResponse.json({ status: 'connected', message: 'Gemini is working!', reply, keyPrefix: apiKey.slice(0, 8) + '...' })
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message })
  }
}
