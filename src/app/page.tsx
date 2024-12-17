import React from 'react'
import { Button } from '../components/ui/button'

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test-db`, {
    cache: 'no-store',
  })
  const data = await res.json()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Book Club App</h1>
      <p className="text-xl mb-8">Your literary journey begins here!</p>
      <Button>Get Started</Button>
      <p className="mt-4">
        Database test: {data.time ? data.time : 'Failed to connect'}
      </p>
    </div>
  )
}
