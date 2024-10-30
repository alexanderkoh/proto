'use client'

import React, { useState, useRef } from 'react'
import { useProtein } from '@/context/ProteinContext'

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

// Popular proteins with their descriptions
const POPULAR_PROTEINS = [
  { id: '1ubq', name: 'Ubiquitin', description: 'Protein modification and degradation' },
  { id: '1crn', name: 'Crambin', description: 'Plant seed protein' },
  { id: '4hhb', name: 'Hemoglobin', description: 'Oxygen transport protein' },
  { id: '1ins', name: 'Insulin', description: 'Blood sugar regulation' },
  { id: '1tim', name: 'Triose Phosphate Isomerase', description: 'Glycolysis enzyme' },
  { id: '3cna', name: 'Concanavalin A', description: 'Plant lectin protein' },
  { id: '1gfl', name: 'Green Fluorescent Protein', description: 'Fluorescent protein from jellyfish' },
  { id: '1hho', name: 'Human Growth Hormone', description: 'Growth regulation protein' },
  { id: '2lyz', name: 'Lysozyme', description: 'Antibacterial enzyme' },
  { id: '1col', name: 'Collagen', description: 'Structural protein' },
] as const;

export default function SearchBox() {
  const [selectedProtein, setSelectedProtein] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { setProteinData, setIsLoading } = useProtein()
  const logsEndRef = useRef<HTMLDivElement>(null)

  const addLog = (type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, type, message }].slice(-10))
    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleProteinSelect = async (proteinId: string) => {
    if (!proteinId) return;
    
    setSelectedProtein(proteinId)
    setIsLoading(true)
    addLog('info', `Loading protein: ${proteinId}`)

    try {
      const response = await fetch(`/api/protein?id=${proteinId}`)
      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch protein')
      }

      addLog('success', `Successfully loaded ${proteinId} (${result.data.length} bytes)`)
      setProteinData(result.data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      addLog('error', `Failed to load protein: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-4">
        <label htmlFor="protein-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Protein
        </label>
        <select
          id="protein-select"
          value={selectedProtein}
          onChange={(e) => handleProteinSelect(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Choose a protein...</option>
          {POPULAR_PROTEINS.map((protein) => (
            <option key={protein.id} value={protein.id}>
              {protein.name} ({protein.id})
            </option>
          ))}
        </select>
        {selectedProtein && (
          <p className="mt-2 text-sm text-gray-600">
            {POPULAR_PROTEINS.find(p => p.id === selectedProtein)?.description}
          </p>
        )}
      </div>

      {/* Debug Panel */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Loading Logs</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-white rounded border border-gray-200 h-40 overflow-y-auto text-sm">
          {logs.length === 0 ? (
            <div className="p-2 text-gray-500 text-center">No logs yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 ${
                    log.type === 'error' ? 'text-red-600 bg-red-50' :
                    log.type === 'success' ? 'text-green-600 bg-green-50' :
                    'text-gray-600'
                  }`}
                >
                  <span className="text-xs text-gray-400 mr-2">{log.timestamp}</span>
                  {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 