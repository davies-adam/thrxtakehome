import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import { supabaseAdmin } from '@/lib/supabase'
import { cleanCountry, cleanDomain, categorizeEmployeeSize, enrichWithAI } from '@/lib/data-cleaning'

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

    const companies = []
    
    for (const row of data as Record<string, unknown>[]) {
      // Basic cleaning
      const cleaned = {
        name: String(row.name || row.company || row.company_name || ''),
        domain: cleanDomain(String(row.domain || row.website || '')),
        country: cleanCountry(String(row.country || row.location || '')),
        city: String(row.city || ''),
        employee_size: categorizeEmployeeSize(String(row.employee_size || row.size || '')),
        raw_json: row
      }

      // AI enrichment
      const enriched = await enrichWithAI(row)
      
      const finalCompany = {
        ...cleaned,
        ...enriched,
        name: enriched.name || cleaned.name,
        domain: enriched.domain || cleaned.domain,
        country: enriched.country || cleaned.country,
        city: enriched.city || cleaned.city,
        employee_size: enriched.employee_size || cleaned.employee_size,
      }

      companies.push(finalCompany)
    }

    // Insert into database
    const { data: inserted, error } = await supabaseAdmin
      .from('companies')
      .insert(companies)
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Processed ${companies.length} companies`,
      inserted: inserted?.length || 0
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 