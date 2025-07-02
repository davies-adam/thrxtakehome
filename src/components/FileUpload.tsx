'use client'

import { useState } from 'react'

export default function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setMessage('Please upload a CSV file')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        window.location.reload()
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch {
      setMessage('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <p className="text-lg font-medium">Upload CSV File</p>
          <p className="text-gray-500">Drag and drop a CSV file here, or click to select</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  )
} 