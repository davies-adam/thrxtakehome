import OpenAI from 'openai'
import { CompanyInput, EMPLOYEE_SIZE_BUCKETS } from '@/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Country code mapping
const countryMap: Record<string, string> = {
  'us': 'United States',
  'usa': 'United States',
  'united states': 'United States',
  'uk': 'United Kingdom',
  'gb': 'United Kingdom',
  'united kingdom': 'United Kingdom',
  'ca': 'Canada',
  'canada': 'Canada',
  'de': 'Germany',
  'germany': 'Germany',
  'fr': 'France',
  'france': 'France',
  'au': 'Australia',
  'australia': 'Australia',
  'jp': 'Japan',
  'japan': 'Japan',
  'cn': 'China',
  'china': 'China',
  'in': 'India',
  'india': 'India',
}

export function cleanCountry(country: string): string {
  if (!country) return ''
  const cleaned = country.toLowerCase().trim()
  return countryMap[cleaned] || country
}

export function cleanDomain(domain: string): string {
  if (!domain) return ''
  return domain.toLowerCase().trim().replace(/\s+/g, '')
}

export function categorizeEmployeeSize(size: string): string {
  if (!size) return '1-10'
  
  const num = parseInt(size.replace(/[^\d]/g, ''))
  if (isNaN(num)) return '1-10'
  
  if (num <= 10) return '1-10'
  if (num <= 50) return '11-50'
  if (num <= 200) return '51-200'
  if (num <= 500) return '201-500'
  if (num <= 1000) return '501-1 000'
  if (num <= 5000) return '1 001-5 000'
  if (num <= 10000) return '5 001-10 000'
  return '10 000+'
}

export async function enrichWithAI(rawData: Record<string, unknown>): Promise<Partial<CompanyInput>> {
  try {
    const prompt = `Clean and standardize this company data. Return JSON with:\n- name: clean company name\n- domain: valid domain (lowercase, no spaces)\n- country: full country name\n- city: clean city name (optional)\n- employee_size: one of [${EMPLOYEE_SIZE_BUCKETS.join(', ')}]\n\nRaw data: ${JSON.stringify(rawData)}\n\nReturn only valid JSON:`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No AI response')

    return JSON.parse(response)
  } catch (error) {
    console.error('AI enrichment failed:', error)
    return {}
  }
} 