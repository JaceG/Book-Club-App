import React from 'react'
import { Button } from '../components/ui/button'
import { query } from '../lib/db'

export default async function Home() {
  let dbTime = 'Unable to fetch database time'
  let error = null

  try {
    const result = await query('SELECT NOW()')
    if (result && result.rows && result.rows.length > 0) {
      dbTime = result.rows[0].now.toISOString()
    } else {
      throw new Error('No result from database')
    }
  } catch (err) {
    console.error('Error in Home component:', err)
    error = err instanceof Error ? err.message : String(err)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Book Club App</h1>
      <p className="text-xl mb-8">Your literary journey begins here!</p>
      <Button>Get Started</Button>
      {error ? (
        <p className="mt-4 text-red-500">Error: {error}</p>
      ) : (
        <p className="mt-4">Database time: {dbTime}</p>
      )}
      <p className="mt-4 text-sm text-gray-500">
        Environment: {process.env.NODE_ENV}, Database URL set:{' '}
        {process.env.POSTGRES_URL ? 'Yes' : 'No'}
      </p>
    </div>
  )
}
