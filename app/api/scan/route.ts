import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/scanner'

function tryParseJson(text: string) {
  try {
    // 1. Try direct parse
    return JSON.parse(text.trim())
  } catch (e) {}

  try {
    // 2. Try to extract JSON from markdown or text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {}

  // 3. Aggressive repair for truncated JSON
  try {
    let fixed = text.trim()
    const start = fixed.indexOf('{')
    if (start === -1) return null
    fixed = fixed.slice(start)
    
    let braces = 0, brackets = 0, inString = false
    for (let i = 0; i < fixed.length; i++) {
       if (fixed[i] === '"' && fixed[i-1] !== '\\') inString = !inString
       if (!inString) {
         if (fixed[i] === '{') braces++
         else if (fixed[i] === '}') braces--
         else if (fixed[i] === '[') brackets++
         else if (fixed[i] === ']') brackets--
       }
    }
    
    if (inString) fixed += '"'
    while (brackets > 0) { fixed += ']'; brackets-- }
    while (braces > 0) { fixed += '}'; braces-- }
    
    return JSON.parse(fixed)
  } catch (e) {}
  return null
}

async function callGemini(model: string, prompt: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    )
    return res
  } catch (e) {
    return null
  }
}

async function analyzeWithGemini(content: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { error: 'Missing API Key' }

  const prompt = `Analyze this for phishing/scams. Respond ONLY with this JSON (be brief):
{
  "riskScore": number,
  "threatLevel": "safe|suspicious|dangerous",
  "category": "string",
  "explanation": "short",
  "aiReasoning": "short",
  "reasoningSteps": ["step"],
  "highlightedPhrases": ["phrase"],
  "recommendations": ["action"],
  "educationTip": "tip"
}
Message: "${content}"`

  try {
    // Fallback chain: 2.5-flash -> 1.5-flash
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash']
    let lastError = null

    for (const modelName of models) {
      const res = await callGemini(modelName, prompt, apiKey)
      
      if (res && res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const parsed = tryParseJson(text)
          if (parsed) return { ...parsed, flags: [] }
        }
      } else if (res) {
        const errorData = await res.json().catch(() => ({}))
        lastError = { error: `API Error ${res.status}`, details: errorData?.error?.message, model: modelName }
        // If it's a 503, try the next model immediately
        if (res.status === 503) continue
      }
    }

    return lastError || { error: 'All models failed' }
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
