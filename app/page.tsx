import React from 'react'
import SearchBox from '@/components/SearchBox'
import ProteinViewer from '@/components/ProteinViewer'
import { ProteinProvider } from '@/context/ProteinContext'
import Link from 'next/link'

export default function Home() {
  return (
    <ProteinProvider>
      <main className="min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Protein Structure Viewer</h1>
          <Link 
            href="/directory" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Browse Protein Directory
          </Link>
        </div>
        <div className="mb-8">
          <SearchBox />
        </div>
        <div className="w-full h-[600px]">
          <ProteinViewer />
        </div>
      </main>
    </ProteinProvider>
  )
} 