import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET() {
  try {
    const result = await query('SELECT NOW()')
    return NextResponse.json({ time: result.rows[0].now })
  } catch (error) {
    console.error('Error in test-db route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
