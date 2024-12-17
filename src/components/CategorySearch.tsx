import React from 'react'
import { Button } from './ui/button'

interface CategorySearchProps {
  onCategorySelect: (category: string) => void
}

const categories = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Adventure',
  'Historical Fiction',
  'Literary Fiction',
  'Contemporary Fiction',
  'Crime Fiction',
  'Dystopian Fiction',
  'Graphic Novel',
]

export default function CategorySearch({
  onCategorySelect,
}: CategorySearchProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onCategorySelect(category)}
          variant="outline"
          className="w-full"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
