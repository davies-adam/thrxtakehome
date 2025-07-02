import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('country')
      .not('country', 'is', null)
      .not('country', 'eq', '')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const countries = [...new Set(data.map(row => row.country))].sort()
    return NextResponse.json(countries)

  } catch (error) {
    console.error('Countries fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 