export interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      thumbnail: string
    }
    subjects?: string[] // Add this line
    firstPublishYear?: number // Add this line
  }
}
