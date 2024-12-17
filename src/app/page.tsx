'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../components/ui/button'
import CategorySearch from '../components/CategorySearch'
import VotingResults from '../components/VotingResults'
import { Book } from '../types/book'

const MapSearch = dynamic(() => import('../components/MapSearch'), {
  ssr: false,
})

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchMethod, setSearchMethod] = useState<'map' | 'category' | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoading(true)
    setError(null)
    setBooks([])

    try {
      const response = await fetch(`/api/books/location?lat=${lat}&lng=${lng}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        )
      }
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        setBooks(data.items)
      } else {
        setError(
          data.message ||
            'No fiction books found for this location. Try another place!'
        )
      }
    } catch (error) {
      console.error('Error searching books by location:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch books')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = async (category: string) => {
    setIsLoading(true)
    setError(null)
    setBooks([])

    try {
      const response = await fetch(
        `/api/books/category?category=${encodeURIComponent(category)}`
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        )
      }
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        setBooks(data.items)
      } else {
        setError('No fiction books found for this category. Try another one!')
      }
    } catch (error) {
      console.error('Error searching books by category:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch books')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Fiction Book Club App
      </h1>
      <p className="text-xl mb-8">
        Discover amazing fiction books for your next read!
      </p>

      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={() => setSearchMethod('map')}
            variant={searchMethod === 'map' ? 'default' : 'outline'}
          >
            Search by Location
          </Button>
          <Button
            onClick={() => setSearchMethod('category')}
            variant={searchMethod === 'category' ? 'default' : 'outline'}
          >
            Search by Category
          </Button>
        </div>

        {searchMethod === 'map' && (
          <>
            <MapSearch onLocationSelect={handleLocationSelect} />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Click anywhere on the map to find fiction books related to that
              location
            </p>
          </>
        )}

        {searchMethod === 'category' && (
          <CategorySearch onCategorySelect={handleCategorySelect} />
        )}
      </div>

      {isLoading && (
        <div className="text-center">
          <p>Searching for fiction books...</p>
        </div>
      )}

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      {!isLoading && books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="border p-4 rounded cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedBook(book)}
            >
              {book.volumeInfo.imageLinks && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="mx-auto mb-2"
                />
              )}
              <h2 className="text-lg font-semibold">{book.volumeInfo.title}</h2>
              <p className="text-gray-600">
                {book.volumeInfo.authors?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      <VotingResults books={books} selectedBook={selectedBook} />
    </div>
  )
}
