'use client'

import { useState, useEffect } from 'react'
import { Company, CompanyFilters } from '@/types/database'

export default function CompanyTable() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CompanyFilters>({})

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.country) params.append('country', filters.country)
        if (filters.employee_size) params.append('employee_size', filters.employee_size)
        if (filters.domain) params.append('domain', filters.domain)

        const response = await fetch(`/api/companies?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCompanies(data)
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [filters])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by country..."
          onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by employee size..."
          onChange={(e) => setFilters(prev => ({ ...prev, employee_size: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by domain..."
          onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
          className="p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Domain</th>
              <th className="px-4 py-2 text-left">Country</th>
              <th className="px-4 py-2 text-left">Size</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-2 text-center">Loading...</td></tr>
            ) : companies.map((company) => (
              <tr key={company.id} className="border-t">
                <td className="px-4 py-2">{company.name}</td>
                <td className="px-4 py-2">{company.domain}</td>
                <td className="px-4 py-2">{company.country}</td>
                <td className="px-4 py-2">{company.employee_size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 