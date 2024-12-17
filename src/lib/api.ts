import { Book } from '../types/book'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const FICTION_CATEGORIES = [
  'Fiction',
  'Novel',
  'Short Stories',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Adventure',
  'Historical Fiction',
  'Literary Fiction',
  'Young Adult Fiction',
  "Children's Fiction",
  'Contemporary Fiction',
  'Crime Fiction',
  'Dystopian Fiction',
  'Graphic Novel',
]

export async function searchBooksByLocation(
  lat: number,
  lng: number
): Promise<Book[]> {
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  const geocodingResponse = await fetch(geocodingUrl)

  if (!geocodingResponse.ok) {
    throw new Error(`Geocoding API error: ${geocodingResponse.status}`)
  }

  const geocodingData = await geocodingResponse.json()

  if (!geocodingData.results || geocodingData.results.length === 0) {
    throw new Error('No location found')
  }

  const addressComponents = geocodingData.results[0].address_components
  const city =
    addressComponents.find((component: any) =>
      component.types.includes('locality')
    )?.long_name || ''
  const country =
    addressComponents.find((component: any) =>
      component.types.includes('country')
    )?.long_name || ''

  const searchQuery = `${city} ${country} fiction`.trim()

  const booksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    searchQuery
  )}&maxResults=40&key=${GOOGLE_API_KEY}`
  const booksResponse = await fetch(booksUrl)

  if (!booksResponse.ok) {
    throw new Error(`Google Books API error: ${booksResponse.status}`)
  }

  const booksData = await booksResponse.json()

  if (!booksData.items) {
    return []
  }

  return booksData.items.filter((book: Book) => isFictionBook(book))
}

export async function searchBooksByCategory(category: string): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
    category
  )}+fiction&maxResults=40&key=${GOOGLE_API_KEY}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`)
  }

  const data = await response.json()
  return (data.items || []).filter((book: Book) => isFictionBook(book))
}

function isFictionBook(book: Book): boolean {
  const categories = book.volumeInfo.categories || []
  const description = book.volumeInfo.description || ''
  const title = book.volumeInfo.title || ''

  // Check if any of the book's categories match our fiction categories
  const hasFictionCategory = categories.some((category) =>
    FICTION_CATEGORIES.some((fictionCat) =>
      category.toLowerCase().includes(fictionCat.toLowerCase())
    )
  )

  // Check if the description or title contains fiction-related keywords
  const hasFictionKeywords = FICTION_CATEGORIES.some(
    (genre) =>
      description.toLowerCase().includes(genre.toLowerCase()) ||
      title.toLowerCase().includes(genre.toLowerCase())
  )

  // More stringent check: require either a fiction category or multiple fiction keywords
  return hasFictionCategory || (hasFictionKeywords && categories.length > 0)
}
