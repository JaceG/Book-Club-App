import React from 'react'
import { Book } from '../types/book'

interface VotingResultsProps {
  books: Book[]
  selectedBook: Book | null
}

export default function VotingResults({
  books,
  selectedBook,
}: VotingResultsProps) {
  if (!selectedBook) {
    return null
  }

  return (
    <div className="mt-8 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Current Selection</h2>
      <div className="flex items-start">
        {selectedBook.volumeInfo.imageLinks && (
          <img
            src={selectedBook.volumeInfo.imageLinks.thumbnail}
            alt={selectedBook.volumeInfo.title}
            className="mr-4"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">
            {selectedBook.volumeInfo.title}
          </h3>
          <p>{selectedBook.volumeInfo.authors?.join(', ')}</p>
          <p className="text-sm text-gray-600 mt-2">
            {selectedBook.volumeInfo.publishedDate &&
              `Published: ${selectedBook.volumeInfo.publishedDate}`}
            {selectedBook.volumeInfo.firstPublishYear &&
              ` (First published: ${selectedBook.volumeInfo.firstPublishYear})`}
          </p>
          <p className="text-sm text-gray-600">
            {selectedBook.volumeInfo.pageCount &&
              `Pages: ${selectedBook.volumeInfo.pageCount}`}
          </p>
          <p className="mt-2">{selectedBook.volumeInfo.description}</p>
          {selectedBook.volumeInfo.subjects &&
            selectedBook.volumeInfo.subjects.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold">Subjects:</h4>
                <p>{selectedBook.volumeInfo.subjects.join(', ')}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
