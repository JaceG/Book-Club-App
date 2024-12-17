import { Book } from '../types/book'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const FICTION_SUBJECTS = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Adventure',
  'Historical',
  'Literary',
  'Contemporary',
  'Crime',
  'Dystopian',
  'Graphic Novel',
  'Young Adult',
  'Paranormal',
  'Urban Fantasy',
  'Steampunk',
  'Cyberpunk',
  'Magical Realism',
  'Gothic',
  'Satire',
  'Humor',
  'War',
  'Western',
  'Espionage',
  'Alternate History',
  'Superhero',
  'Fairy Tales',
  'Mythology',
  'Folklore',
  'Short Stories',
  'Poetry',
  'Epistolary',
  'Experimental',
  'Bildungsroman',
  'Psychological',
  'Speculative',
]

export async function searchBooksByLocation(
  lat: number,
  lng: number
): Promise<Book[]> {
  try {
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
    const state =
      addressComponents.find((component: any) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name || ''
    const country =
      addressComponents.find((component: any) =>
        component.types.includes('country')
      )?.long_name || ''

    if (!city && !country) {
      throw new Error('Location details not found')
    }

    const isUSA = country === 'United States'
    const searchQuery = `${city} ${isUSA ? state : country} fiction`.trim()

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

    return booksData.items
      .filter((book: Book) => isFictionBook(book))
      .filter((book: Book) =>
        isRelevantToLocation(book, city, state, country, isUSA)
      )
      .sort(
        (a: Book, b: Book) =>
          getRelevanceScore(b, city, state, country, isUSA) -
          getRelevanceScore(a, city, state, country, isUSA)
      )
  } catch (error) {
    console.error('Error in searchBooksByLocation:', error)
    throw error
  }
}

function isRelevantToLocation(
  book: Book,
  city: string,
  state: string,
  country: string,
  isUSA: boolean
): boolean {
  const description = book.volumeInfo.description || ''
  const title = book.volumeInfo.title || ''

  const locationKeywords = isUSA ? [city, state] : [city, country]

  return locationKeywords.some(
    (keyword) =>
      description.toLowerCase().includes(keyword.toLowerCase()) ||
      title.toLowerCase().includes(keyword.toLowerCase())
  )
}

function getRelevanceScore(
  book: Book,
  city: string,
  state: string,
  country: string,
  isUSA: boolean
): number {
  const description = book.volumeInfo.description || ''
  const title = book.volumeInfo.title || ''

  let score = 0

  if (description.toLowerCase().includes(city.toLowerCase())) score += 3
  if (title.toLowerCase().includes(city.toLowerCase())) score += 1

  if (isUSA) {
    if (description.toLowerCase().includes(state.toLowerCase())) score += 2
    if (title.toLowerCase().includes(state.toLowerCase())) score += 1
  } else {
    if (description.toLowerCase().includes(country.toLowerCase())) score += 2
    if (title.toLowerCase().includes(country.toLowerCase())) score += 1
  }

  return score
}

export async function searchBooksByCategory(category: string): Promise<Book[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
      category
    )}+fiction&maxResults=40&key=${GOOGLE_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items) {
      return []
    }

    return data.items.filter((book: Book) => isFictionBook(book))
  } catch (error) {
    console.error('Error in searchBooksByCategory:', error)
    throw error
  }
}

function isFictionBook(book: Book): boolean {
  const categories = book.volumeInfo.categories || []

  const isFiction = categories.some((category) =>
    FICTION_SUBJECTS.some((subject) =>
      category.toLowerCase().includes(subject.toLowerCase())
    )
  )

  if (!isFiction && categories.length > 0) {
    return categories.some((category) =>
      category.toLowerCase().includes('fiction')
    )
  }

  return isFiction
}

function logBookDetails(book: Book) {
  console.log('Book Title:', book.volumeInfo.title)
  console.log('Categories:', book.volumeInfo.categories)
  console.log('Is Fiction:', isFictionBook(book))
  console.log('Description:', book.volumeInfo.description)
}

export { logBookDetails }
