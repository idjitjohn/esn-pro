import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Prospect from '@/models/Prospect'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const link = url.searchParams.get('link')

  await connectToDatabase()

  if (link) {
    const prospect = await Prospect.findOne({ link }).lean()
    if (!prospect) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    return NextResponse.json({ prospect })
  }

  const prospects = await Prospect.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json({ prospects })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { link, name, image, data, message, posts } = body

  if (!link) return NextResponse.json({ error: 'Link is required' }, { status: 400 })

  await connectToDatabase()

  try {
    const prospect = await Prospect.create({ link, name, image, data, message, posts })
    return NextResponse.json({ prospect }, { status: 201 })
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Prospect with this link already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { id, ...updates } = await request.json()

  if (!id) return NextResponse.json({ error: 'Id is required' }, { status: 400 })

  await connectToDatabase()

  try {
    const prospect = await Prospect.findByIdAndUpdate(id, updates, { new: true })
    if (!prospect) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    return NextResponse.json({ prospect })
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Prospect with this link already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
