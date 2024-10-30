import React from 'react'
import Link from 'next/link'
import ProteinDirectory from '@/components/ProteinDirectory'
import { ProteinProvider } from '@/context/ProteinContext'

export default function DirectoryPage() {
  return (
    <ProteinProvider>
      <main className="min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Protein Directory</h1>
          <Link 
            href="/" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Viewer
          </Link>
        </div>
        <ProteinDirectory />
      </main>
    </ProteinProvider>
  )
} 