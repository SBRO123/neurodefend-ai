import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/scanner'

function tryParseJson(text: string) {
  const trimmed = text.trim()
  try {
    // 1. Try direct parse
    return JSON.parse(trimmed)
  } catch (e) {}

  try {
    // 2. Try to extract JSON from markdown or text
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {}

  // 3. Aggressive repair for truncated JSON
  try {
    let fixed = trimmed
    const start = fixed.indexOf('{')
    if (start === -1) return null
    fixed = fixed.slice(start)
    
    let braces = 0, brackets = 0, inString = false
    for (let i = 0; i < fixed.length; i++) {
       if (fixed[i] === '"' && (i === 0 || fixed[i-1] !== '\\')) inString = !inString
       if (!inString) {
         if (fixed[i] === '{') braces++
         else if (fixed[i] === '}') braces--
         else if (fixed[i] === '[') brackets++
         else if (fixed[i] === ']') brackets--
       }
    }
    
    // Repair steps
    if (inString) fixed += '"'
    
    // Remove a trailing comma if the JSON was cut off mid-object
    fixed = fixed.replace(/,\s*$/, '')
    
    while (brackets > 0) { fixed += ']'; brackets-- }
    while (braces > 0) { fixed += '}'; braces-- }
    
    // Final attempt at parsing repaired string
    return JSON.parse(fixed)
  } catch (e) {}
  return null
}

async function callGemini(model: string, prompt: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
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

  const prompt = `Analyze this South African message for phishing/scams. 
Respond ONLY with this JSON:
{
  "riskScore": number,
  "threatLevel": "safe|suspicious|dangerous",
  "category": "string",
  "explanation": "string",
  "aiReasoning": "string",
  "reasoningSteps": ["string"],
  "highlightedPhrases": ["string"],
  "recommendations": ["string"],
  "educationTip": "string"
}
Message: "${content}"`

  try {
    const models = ['gemini-2.5-flash', 'gemini-flash-latest']
    let lastError = null

    for (const modelName of models) {
      const res = await callGemini(modelName, prompt, apiKey)
      
      if (res && res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (text) {
          const parsed = tryParseJson(text)
          if (parsed) return { ...parsed, flags: [] }
          
          lastError = { error: 'Invalid JSON format', raw: text.slice(0, 500), model: modelName }
        } else {
          lastError = { error: 'Empty response text', model: modelName }
        }
      } else if (res) {
        const errorData = await res.json().catch(() => ({}))
        lastError = { error: `API Error ${res.status}`, details: errorData?.error?.message, model: modelName }
        if (res.status === 503) continue
      } else {
        lastError = { error: 'Fetch failed (null response)', model: modelName }
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
