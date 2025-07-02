import OpenAI from 'openai'
import { CompanyInput, EmployeeSize } from '@/types/database'
import { COUNTRY_MAPPINGS } from './country-list'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

function categorizeEmployeeSize(size: string): EmployeeSize {
  if (!size) return '1-10'
  
  const num = parseInt(size)
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


function normaliseCountry(iso_3166_1: string): string {
  return iso_3166_1 in COUNTRY_MAPPINGS ? COUNTRY_MAPPINGS[iso_3166_1.toLowerCase()] : ''
}

function normaliseDomain(rawDomain: string): string {  
  try {
    let domain = rawDomain.trim().toLowerCase()
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain
    }
    return new URL(domain).hostname
  } catch {
    return ''
  }
}


const ENRICHMENT_SYSTEM_PROMPT = `
You are a helpful assistant dealing with messy, inconsistent data describing a number of corporate entities.
You will be given a messy set of key-value pairs (in the following JSON format) and you will need to clean and standardize each key-value pair.

For example, given the following JSON:
{"name": "Apple Inc.", "domain": " apple. com", "country": "U S of A",  "city": "Cupertino, CA, USA", "employee_size": "100000++"}

You should return:
{
  "name": "Apple", // As a bare string corresponding to the company name alone, without the "Inc." or "LLC" or other legal suffixes
  "domain": "apple.com", // As a likely, valid domain name
  "country": "us", // A 2-letter ISO 3166-1 alpha-2 country code like us, gb, jp, etc.
  "city": "Cupertino", // As a bare string corresponding to the city name alone, without state, province, or country
  "employee_size": "10000" // As an integer
}

For another example, given the following JSON:
{"name": "Friendly Unnamed", "domain": " Inc", "country": "China",  "city": "Hangzhou", "employee_size": "4,000"}

You should return:
{
  "name": "Friendly Unnamed", // As a bare string corresponding to the company name alone, without the "Inc." or "LLC" or other legal suffixes
  "domain": "", // As a likely, valid domain name. If the domain is not clear, return an empty string.
  "country": "cn", // A 2-letter ISO 3166-1 alpha-2 country code like us, gb, jp, etc.
  "city": "Hangzhou", // As a bare string corresponding to the city name alone, without state, province, or country
  "employee_size": "4000" // As an integer
}

ALWAYS provide a valid name. All other fields can be empty strings if not clear.
`

export async function standardiseWithAI(rawData: Record<string, unknown>): Promise<Partial<CompanyInput>> {
  try {
    const prompt = ENRICHMENT_SYSTEM_PROMPT + `\n\nRaw data: ${JSON.stringify(rawData)}\n\nReturn only valid JSON with no markdown:`
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No AI response')

    const aiNormalised = JSON.parse(response)
    return {
      name: aiNormalised.name,
      domain: normaliseDomain(aiNormalised.domain),
      country: normaliseCountry(aiNormalised.country),
      city: aiNormalised.city,
      employee_size: categorizeEmployeeSize(aiNormalised.employee_size.toString()),
      raw_json: rawData
    }

  } catch (error) {
    console.error('AI enrichment failed:', error)
    return {}
  }
} 