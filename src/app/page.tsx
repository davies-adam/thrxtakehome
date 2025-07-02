import FileUpload from '@/components/FileUpload'
import CompanyTable from '@/components/CompanyTable'

export default function Home() {
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
            <CompanyTable />
          </div>
        </div>
      </div>
    </main>
  )
}
