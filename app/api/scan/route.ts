import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/scanner'

async function analyzeWithGemini(content: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const prompt = `You are a cybersecurity AI specializing in South African scams. Analyze this message for phishing, scams, or fraud (NeuroDefend AI):

"${content}"

Respond in this exact JSON format only, no extra text:
{
  "riskScore": <number 0-100>,
  "threatLevel": "<safe|suspicious|dangerous>",
  "category": "<main threat category>",
  "explanation": "<one sentence summary>",
  "aiReasoning": "<detailed explanation of why this is or isn't a threat>",
  "reasoningSteps": ["<step1>", "<step2>", "<step3>"],
  "highlightedPhrases": ["<phrase1>", "<phrase2>"],
  "recommendations": ["<action1>", "<action2>", "<action3>"],
  "educationTip": "<one educational tip about this type of scam>"
}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 1024,
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('Gemini API Error:', res.status, errorData)
      return null
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!text) {
      console.error('Gemini Error: No text in response', data)
      if (data?.promptFeedback?.blockReason) {
        console.error('Gemini Block Reason:', data.promptFeedback.blockReason)
      }
      return null
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Gemini Error: Could not find JSON in response', text)
      return null
    }

    try {
      const parsed = JSON.parse(jsonMatch[0])

      // Validate required fields exist
      if (typeof parsed.riskScore !== 'number' || !parsed.threatLevel) {
        console.error('Gemini Error: Missing required fields in JSON', parsed)
        return null
      }

      return { ...parsed, flags: [] }
    } catch (e) {
      console.error('Gemini Error: JSON Parse failed', e, jsonMatch[0])
      return null
    }
  } catch (err) {
    console.error('Gemini Analysis Exception:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content too long (max 5000 chars)' }, { status: 400 })
    }

    const trimmed = content.trim()

    // Try Gemini first, fall back to rule-based scanner
    const geminiResult = await analyzeWithGemini(trimmed)
    const result = geminiResult ?? analyzeContent(trimmed)

    return NextResponse.json({
      success: true,
      result,
      engine: geminiResult ? 'gemini' : 'rule-based'
    })
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
