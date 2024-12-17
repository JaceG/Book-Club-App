import { NextResponse } from 'next/server'
import { searchBooksByLocation, logBookDetails } from '../../../../lib/api'

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

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      )
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: 'Coordinates out of range' },
        { status: 400 }
      )
    }

    const books = await searchBooksByLocation(latitude, longitude)

    console.log(`Found ${books.length} books`)
    books.forEach((book) => logBookDetails(book))

    if (books.length === 0) {
      return NextResponse.json({
        items: [],
        message: 'No fiction books found for this location',
      })
    }

    return NextResponse.json({ items: books })
  } catch (error) {
    console.error('Location search error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { error: errorMessage },
      {
        status:
          error instanceof Error && error.message.includes('No location found')
            ? 404
            : 500,
      }
    )
  }
}
