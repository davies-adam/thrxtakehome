export interface Company {
  id: string
  name: string
  domain: string
  country: string
  city?: string
  employee_size: string
  raw_json: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CompanyInput {
  name: string
  domain: string
  country: string
  city?: string
  employee_size: string
  raw_json: Record<string, unknown>
}

export interface CompanyFilters {
  country?: string
  employee_size?: string
  domain?: string
}

export const EMPLOYEE_SIZE_BUCKETS = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1 000',
  '1 001-5 000',
  '5 001-10 000',
  '10 000+'
] as const

export type EmployeeSize = typeof EMPLOYEE_SIZE_BUCKETS[number] 