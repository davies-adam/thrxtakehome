import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const employee_size = searchParams.get('employee_size')
    const domain = searchParams.get('domain')

    let query = supabase
      .from('companies')
      .select('*')
      .order('name')

    if (country) {
      query = query.ilike('country', `%${country}%`)
    }

    if (employee_size) {
      query = query.eq('employee_size', employee_size)
    }

    if (domain) {
      query = query.ilike('domain', `%${domain}%`)
    }

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