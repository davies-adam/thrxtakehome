import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    let query = supabase.from('companies').select('*').order('name')

    const { searchParams } = new URL(request.url)

    const exactMatchFilters = ["country", "employee_size"]
    const partialMatchFilters = ["domain"]

    exactMatchFilters.forEach((param: string) => {
      const value = searchParams.get(param)
      if (value) {
        query = query.eq(param, value)
      }
    })

    partialMatchFilters.forEach((param: string) => {
      const value = searchParams.get(param)
      if (value) {
        query = query.ilike(param, `%${value}%`)
      }
    })

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Companies fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 