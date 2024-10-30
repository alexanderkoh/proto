import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')?.toLowerCase()

  console.log('API: Fetching protein with ID:', id)

  if (!id) {
    console.log('API: No protein ID provided')
    return NextResponse.json(
      { error: 'Protein ID is required' },
      { status: 400 }
    )
  }

  try {
    console.log('API: Fetching from PDB URL:', `https://files.rcsb.org/view/${id}.pdb`)
    
    // Fetch from PDB with proper headers
    const response = await fetch(`https://files.rcsb.org/view/${id}.pdb`, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'ProteinViewer/1.0'
      }
    })
    
    if (!response.ok) {
      console.error('API: PDB response not OK:', response.status, response.statusText)
      throw new Error(`Failed to fetch protein data: ${response.statusText}`)
    }
    
    const data = await response.text()
    console.log('API: Received data length:', data.length)
    console.log('API: First 100 characters:', data.substring(0, 100))

    // Basic validation of PDB data
    if (!data.includes('ATOM') || data.length < 100) {
      console.error('API: Invalid PDB data received')
      throw new Error('Invalid PDB data received')
    }

    // Clean up the PDB data
    const cleanData = data
      .split('\n')
      .filter(line => line.startsWith('ATOM') || line.startsWith('HETATM') || line.startsWith('TER'))
      .join('\n')

    console.log('API: Clean data length:', cleanData.length)
    console.log('API: First 100 characters of clean data:', cleanData.substring(0, 100))

    return NextResponse.json({ data: cleanData })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch protein data' },
      { status: 500 }
    )
  }
} 