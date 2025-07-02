'use client'

import { useState, useEffect, useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import FileUpload from '@/components/FileUpload'
import { Company } from '@/types/database'

const columnHelper = createColumnHelper<Company>()

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState({ country: '', employee_size: '', domain: '' })
  const [filterOptions, setFilterOptions] = useState({ countries: [], employeeSizes: [] })

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('domain', { header: 'Domain' }),
      columnHelper.accessor('country', { header: 'Country' }),
      columnHelper.accessor('city', { header: 'City' }),
      columnHelper.accessor('employee_size', { header: 'Size' }),
    ],
    []
  )

  const table = useReactTable({ data: companies, columns, getCoreRowModel: getCoreRowModel()})

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [countriesRes, sizesRes] = await Promise.all([
          fetch('/api/countries'),
          fetch('/api/employee-sizes')
        ])

        if (countriesRes.ok) {
          const countriesData = await countriesRes.json()
          setFilterOptions(prev => ({ ...prev, countries: countriesData }))
        }

        if (sizesRes.ok) {
          const sizesData = await sizesRes.json()
          setFilterOptions(prev => ({ ...prev, employeeSizes: sizesData }))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const params = new URLSearchParams()
        if (filters.country) params.append('country', filters.country)
        if (filters.employee_size) params.append('employee_size', filters.employee_size)
        if (filters.domain) params.append('domain', filters.domain)

        const response = await fetch(`/api/companies?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setCompanies(data)
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }

    fetchCompanies()
  }, [filters])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Company Data Platform</h1>
          <p className="text-gray-600">Upload, clean, and filter company data</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upload CSV</h2>
            <FileUpload />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Companies</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="">All Countries</option>
                  {filterOptions.countries.map((country: string) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.employee_size}
                  onChange={(e) => setFilters(prev => ({ ...prev, employee_size: e.target.value }))}
                  className="p-2 border rounded"
                >
                  <option value="">All Sizes</option>
                  {filterOptions.employeeSizes.map((size: string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Filter by domain..."
                  value={filters.domain}
                  onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
                  className="p-2 border rounded"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-2 text-left"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
