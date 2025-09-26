import { NextResponse } from 'next/server'

type Persona = 'resort' | 'realtor' | 'hospitality' | 'events'

interface GenerateBody {
  persona?: Persona
  focus?: string
  cadence?: string
  tone?: 'Elegant' | 'Bold' | 'Minimal' | 'Friendly'
}

function fallbackGenerate(input: GenerateBody) {
  const { persona = 'realtor', focus = 'authority', cadence = 'steady', tone = 'Elegant' } = input
  const toneAdj = tone.toLowerCase()
  const brand = {
    resort: 'Luxury Resort',
    realtor: 'Real Estate',
    hospitality: 'Hospitality',
    events: 'Weddings & Events',
  }[persona]

  const hooks = [
    `Inside ${brand}: 3 features buyers miss at first glance`,
    `60 seconds at ${brand}: why this stands out in ${toneAdj} detail`,
    `POV walk‑through: the hidden moments that sell`,
    `From first frame to booking: ${focus} flow explained`,
    `Twilight reveal: the scene that converts` ,
  ]
  const titles = [
    `${brand} Story — A ${tone} Tour`,
    `${brand} In 60 Seconds: ${focus} Edition`,
    `What Makes This ${brand} Special` ,
    `${brand}: Designed To Convert`,
    `Twilight Tour: ${brand}` ,
  ]
  const captions = [
    `Hook → proof → offer. ${tone} coverage built to convert.`,
    `One day, multi‑format output. ${cadence} cadence for compounding reach.`,
    `POV + lifestyle + hero film. Site orchestration included.`,
    `From scroll to inquiry in under 30s.`,
    `Shot to publish in 48h.`,
  ]
  const beats = [
    'Hook: first 2 seconds, movement + reveal',
    'Proof: 3 signature features with close‑ups',
    'Lifestyle: human scale, natural light, sound texture',
    'Offer: book/view now with on‑screen CTA',
  ]

  return { hooks, titles, captions, beats, tone, persona, focus, cadence }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateBody
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(fallbackGenerate(body))
    }

    const banned = ['hate','violence','explicit','slur','spam']
    const prompt = [
      'System role: You are a creative director for a luxury media + web studio. Keep brand-safe, concise, high-conversion copy. Never include profanity, personal data, or platform policy violations.',
      `Banned terms: ${banned.join(', ')}. Avoid them.`,
      'Output requirements:',
      '- 5 hooks (<=80 chars)',
      '- 5 IG captions (<=140 chars)',
      '- 5 YouTube titles (<=70 chars)',
      '- 4-beat storyboard bullets (short)',
      `Persona: ${body.persona || 'realtor'}. Focus: ${body.focus || 'authority'}. Cadence: ${body.cadence || 'steady'}. Tone: ${body.tone || 'Elegant'}.`,
      'Return strict JSON with keys: hooks, captions, titles, beats. No commentary.',
    ].join('\n')

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You produce concise, high‑conversion creative. Respect brand-safety and output constraints.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!r.ok) {
      return NextResponse.json(fallbackGenerate(body))
    }
    const data = await r.json()
    const content: string | undefined = data?.choices?.[0]?.message?.content
    if (!content) return NextResponse.json(fallbackGenerate(body))

    // Try parse and validate JSON; clamp lengths
    try {
      const parsed = JSON.parse(content)
      const clamp = (arr: unknown, maxLen: number) => Array.isArray(arr) ? arr.map(x => String(x).slice(0, maxLen)).slice(0, 10) : []
      const hooks = clamp(parsed.hooks, 80)
      const captions = clamp(parsed.captions, 140)
      const titles = clamp(parsed.titles, 70)
      const beats = clamp(parsed.beats, 120)
      return NextResponse.json({ hooks, captions, titles, beats, persona: body.persona, focus: body.focus, cadence: body.cadence, tone: body.tone })
    } catch {
      return NextResponse.json(fallbackGenerate(body))
    }
  } catch {
    // Always return JSON fallback instead of throwing so the UI never hard-fails
    return NextResponse.json(fallbackGenerate({}))
  }
}


