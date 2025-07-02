import { NextResponse } from 'next/server'
import { EMPLOYEE_SIZE_BUCKETS } from '@/types/database'

export async function GET() {
  try {
    return NextResponse.json(EMPLOYEE_SIZE_BUCKETS)
  } catch (error) {
    console.error('Employee sizes fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 