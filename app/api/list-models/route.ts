import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ status: 'missing', message: 'GEMINI_API_KEY is not set' })
  }

  try {
    // List models using the v1beta endpoint
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const data = await res.json()
    
    if (!res.ok) {
      return NextResponse.json({ 
        status: 'error', 
        message: data?.error?.message || 'Failed to list models', 
        httpStatus: res.status 
      })
    }

    // Filter for models that support generateContent
    const supportedModels = data.models
      ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description
      }))

    return NextResponse.json({ 
      status: 'success', 
      count: supportedModels?.length,
      models: supportedModels 
    })
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message })
  }
}
