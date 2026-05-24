import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/scanner'

function tryParseJson(text: string) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {}

  // Attempt to fix truncated JSON if it ends abruptly
  try {
    let fixedText = text.trim()
    if (fixedText.includes('{') && !fixedText.endsWith('}')) {
      // Very basic repair: find the last valid key/value and close it
      if (fixedText.includes('"reasoningSteps": [')) {
        fixedText = fixedText.split('"reasoningSteps": [')[0] + 
                    '"reasoningSteps": ["Truncated due to length"], "highlightedPhrases": [], "recommendations": [], "educationTip": "Verification failed."}'
        return JSON.parse(fixedText.match(/\{[\s\S]*\}/)![0])
      }
    }
  } catch (e) {}
  return null
}

async function analyzeWithGemini(content: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { error: 'Missing API Key' }

  const prompt = `Analyze this for cybersecurity threats (phishing/scams). Respond ONLY in this JSON format:
{
  "riskScore": <number>,
  "threatLevel": "safe|suspicious|dangerous",
  "category": "string",
  "explanation": "string",
  "aiReasoning": "string",
  "reasoningSteps": ["string"],
  "highlightedPhrases": ["string"],
  "recommendations": ["string"],
  "educationTip": "string"
}

Content: "${content}"`

  try {
    let res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 2048, 
            responseMimeType: "application/json" 
          }
        })
      }
    )

    if (!res.ok) {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
          })
        }
      )
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return { error: `API Error ${res.status}`, details: errorData?.error?.message }
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return { error: 'No response text' }

    const parsed = tryParseJson(text)
    if (!parsed) return { error: 'Invalid JSON format', raw: text.slice(0, 100) }

    return { ...parsed, flags: [] }
  } catch (err: any) {
    return { error: 'Exception occurred', message: err.message }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const geminiResult = await analyzeWithGemini(content.trim())
    
    // Check if result is a valid ScanResult (has riskScore) or an error object
    const isSuccess = geminiResult && 'riskScore' in geminiResult
    const result = isSuccess ? geminiResult : analyzeContent(content.trim())

    return NextResponse.json({
      success: true,
      result,
      engine: isSuccess ? 'gemini' : 'rule-based',
      debug: isSuccess ? null : geminiResult
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
