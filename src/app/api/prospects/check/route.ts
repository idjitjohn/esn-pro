import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Prospect from '@/models/Prospect'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const link = url.searchParams.get('link')

  await connectToDatabase()

  const query = id ? { _id: id } : link ? { link } : null
  if (!query) return NextResponse.json({ error: 'Provide id or link' }, { status: 400 })

  const prospect = await Prospect.findOne(query).lean()
  return NextResponse.json({ prospect: prospect || null })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, link, action } = body

  await connectToDatabase()

  const query = id ? { _id: id } : link ? { link } : null
  if (!query) return NextResponse.json({ error: 'Provide id or link' }, { status: 400 })

  if (action === 'mark') {
    const updated = await Prospect.findOneAndUpdate(query, { prospected: true }, { new: true })
    return NextResponse.json({ prospect: updated || null })
  }

  if (action === 'toggle') {
    const current = await Prospect.findOne(query)
    if (!current) return NextResponse.json({ prospect: null })
    current.prospected = !current.prospected
    await current.save()
    return NextResponse.json({ prospect: current })
  }

  const prospect = await Prospect.findOne(query).lean()
  return NextResponse.json({ prospect: prospect || null })
}
