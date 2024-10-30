import SearchBox from '@/components/SearchBox'
import ProteinViewer from '@/components/ProteinViewer'
import { ProteinProvider } from '@/context/ProteinContext'

export default function Home() {
  return (
    <ProteinProvider>
      <main className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-8">Protein Structure Viewer</h1>
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