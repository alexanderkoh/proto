'use client'

import { useState } from 'react'

export default function SearchBox() {
  const [query, setQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
  }

  return (
    <form onSubmit={handleSearch} className="max-w-md">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter protein ID (e.g., 1crn)"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  )
} 