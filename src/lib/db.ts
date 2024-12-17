import { Pool } from '@neondatabase/serverless'

let pool: Pool

export async function query(text: string, values: any[] = []) {
  if (!pool) {
    const connectionString =
      process.env.POSTGRES_URL || process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('Database connection string is not set')
    }
    pool = new Pool({ connectionString })
  }

  try {
    console.log('Attempting database query:', text)
    const result = await pool.query(text, values)
    console.log('Query result:', result)
    return result
  } catch (error) {
    console.error('Database error:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}
