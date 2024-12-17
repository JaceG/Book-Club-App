import { NextResponse } from 'next/server'
import { searchBooksByLocation } from '../../../../lib/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const books = await searchBooksByLocation(parseFloat(lat), parseFloat(lng))

    if (books.length === 0) {
      return NextResponse.json({
        items: [],
        message: 'No fiction books found for this location',
      })
    }

    return NextResponse.json({ items: books })
  } catch (error) {
    console.error('Location search error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch books',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
