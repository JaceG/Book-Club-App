import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Book Club App
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/clubs">Clubs</Link>
            </li>
            <li>
              <Link href="/books">Books</Link>
            </li>
            <li>
              <Button variant="secondary">Sign In</Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
