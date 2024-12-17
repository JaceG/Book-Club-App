import { NextResponse } from 'next/server'
import { searchBooksByCategory } from '../../../../lib/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    const books = await searchBooksByCategory(category)
    return NextResponse.json({ items: books })
  } catch (error) {
    console.error('Category search error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    const isGoogleApiError = errorMessage.includes('Google Books API error')

    return NextResponse.json(
      { error: errorMessage },
      { status: isGoogleApiError ? 400 : 500 }
    )
  }
}
