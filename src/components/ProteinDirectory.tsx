'use client'

import React from 'react'

// Protein categories with their entries
const PROTEIN_CATEGORIES = {
  'Enzymes': [
    { id: '1tim', name: 'Triose Phosphate Isomerase', description: 'Glycolysis enzyme' },
    { id: '2lyz', name: 'Lysozyme', description: 'Antibacterial enzyme' },
  ],
  'Structural Proteins': [
    { id: '1col', name: 'Collagen', description: 'Structural protein' },
    { id: '1ubq', name: 'Ubiquitin', description: 'Protein modification and degradation' },
  ],
  'Transport Proteins': [
    { id: '4hhb', name: 'Hemoglobin', description: 'Oxygen transport protein' },
    { id: '1ins', name: 'Insulin', description: 'Blood sugar regulation' },
  ],
  'Plant Proteins': [
    { id: '1crn', name: 'Crambin', description: 'Plant seed protein' },
    { id: '3cna', name: 'Concanavalin A', description: 'Plant lectin protein' },
  ],
  'Fluorescent Proteins': [
    { id: '1gfl', name: 'Green Fluorescent Protein', description: 'Fluorescent protein from jellyfish' },
  ],
  'Hormones': [
    { id: '1hho', name: 'Human Growth Hormone', description: 'Growth regulation protein' },
  ],
}

export default function ProteinDirectory() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(PROTEIN_CATEGORIES).map(([category, proteins]) => (
        <div key={category} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">{category}</h2>
          <div className="space-y-4">
            {proteins.map((protein) => (
              <div key={protein.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{protein.name}</h3>
                    <p className="text-sm text-gray-600">{protein.description}</p>
                  </div>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {protein.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}