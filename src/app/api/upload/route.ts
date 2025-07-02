import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import { supabaseAdmin } from '@/lib/supabase'
import { standardiseWithAI } from '@/lib/data-cleaning'

async function uploadCompanies(rawData: Record<string, unknown>[]) {
  const companies = await Promise.all(rawData.map(row => standardiseWithAI(row)))
  const { error } = await supabaseAdmin.from('companies').insert(companies).select()
  if (error) {
    console.error(error)
    throw new Error('Database error')
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const { data, errors } = Papa.parse<Record<string, unknown>>(text, { header: true })

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 })
    }
    await uploadCompanies(data)
    return NextResponse.json({ message: 'Upload successful' }, { status: 200 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 