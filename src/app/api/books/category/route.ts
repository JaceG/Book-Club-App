import { NextResponse } from 'next/server'
import { searchBooksByCategory } from '../../../../lib/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 })
  }

  try {
    const books = await searchBooksByCategory(category)

    if (books.length === 0) {
      return NextResponse.json({
        items: [],
        message: 'No fiction books found for this category',
      })
    }

    return NextResponse.json({ items: books })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch books',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
