import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Protein ID is required' },
      { status: 400 }
    )
  }

  try {
    // Example API call to PDB (Protein Data Bank)
    const response = await fetch(`https://files.rcsb.org/view/${id}.pdb`)
    const data = await response.text()

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch protein data' },
      { status: 500 }
    )
  }
} 