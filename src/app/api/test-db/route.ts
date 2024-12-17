import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET() {
  try {
    const result = await query('SELECT NOW()')
    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error('No result from database')
    }
    return NextResponse.json({ time: result.rows[0].now })
  } catch (error) {
    console.error('Error in test-db route:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
