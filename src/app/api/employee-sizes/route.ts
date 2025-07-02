import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { EMPLOYEE_SIZE_BUCKETS } from '@/types/database'

export async function GET() {
  try {
    const { data, error } = await supabase.from('companies').select('employee_size').not('employee_size', 'eq', '').order('employee_size')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const uniqueSizes = [...new Set(data.map(item => item.employee_size))].sort((a, b) => 
      EMPLOYEE_SIZE_BUCKETS.indexOf(a) - EMPLOYEE_SIZE_BUCKETS.indexOf(b)
    )

    return NextResponse.json(uniqueSizes)

  } catch (error) {
    console.error('Employee sizes fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 