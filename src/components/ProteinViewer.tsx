'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useProtein } from '@/context/ProteinContext'

interface ViewerLog {
  timestamp: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

declare global {
  interface Window {
    $3Dmol: any;
    jQuery: any;
  }
}

export default function ProteinViewer() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const { proteinData, isLoading } = useProtein()
  const viewerInstance = useRef<any>(null)
  const [logs, setLogs] = useState<ViewerLog[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)
  const [currentProteinId, setCurrentProteinId] = useState<string | null>(null)

  const addLog = (type: ViewerLog['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, type, message }].slice(-10))
    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Extract protein ID from PDB data
  const extractProteinId = (pdbData: string): string => {
    const headerMatch = pdbData.match(/HEADER.*\s+(\w{4})\s*$/m)
    return headerMatch ? headerMatch[1] : 'Unknown'
  }

  // Initialize viewer and handle protein data
  useEffect(() => {
    if (!proteinData || !viewerRef.current) return;

    const proteinId = extractProteinId(proteinData)
    setCurrentProteinId(proteinId)
    addLog('info', `Starting visualization for protein ${proteinId}`)

    // Load required scripts
    const loadViewer = async () => {
      try {
        // Load jQuery if not already loaded
        if (!window.jQuery) {
          addLog('info', 'Loading jQuery...')
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
          addLog('success', 'jQuery loaded')
        }

        // Load 3Dmol if not already loaded
        if (!window.$3Dmol) {
          addLog('info', 'Loading 3DMol...')
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://3Dmol.org/build/3Dmol-min.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
          addLog('success', '3DMol loaded')
        }

        // Wait a bit for scripts to initialize
        await new Promise(resolve => setTimeout(resolve, 100))

        // Clear previous viewer
        if (viewerInstance.current) {
          addLog('info', 'Clearing previous viewer')
          viewerInstance.current.clear()
        }

        // Create new viewer
        addLog('info', 'Creating viewer instance')
        viewerRef.current.innerHTML = ''
        viewerInstance.current = window.$3Dmol.createViewer(viewerRef.current, {
          backgroundColor: 'white',
          antialias: true,
        })

        // Add model
        addLog('info', `Adding protein model ${proteinId}`)
        const model = viewerInstance.current.addModel(proteinData, "pdb")
        
        // Wait for model to be processed
        await new Promise(resolve => setTimeout(resolve, 100))

        // Apply styles with proper coloring - simpler approach
        addLog('info', 'Applying visualization styles')
        viewerInstance.current.setStyle({}, {
          cartoon: {
            color: 'spectrum',
            thickness: 0.8
          }
        })

        // Add stick representation
        viewerInstance.current.addStyle({}, {
          stick: {
            radius: 0.2,
            colorscheme: 'chainHetatm'
          }
        })

        // Remove surface representation for now
        // viewerInstance.current.addSurface(...)

        // Center and render
        viewerInstance.current.zoomTo()
        viewerInstance.current.render()
        addLog('success', `Protein ${proteinId} rendered with colors`)

        // Add spin control with smoother rotation
        let isSpinning = false
        viewerRef.current?.addEventListener('dblclick', () => {
          isSpinning = !isSpinning
          viewerInstance.current.spin(isSpinning ? 'y' : false, 1)
          addLog('info', isSpinning ? 'Started rotation' : 'Stopped rotation')
        })

        // Add hover effect with more information
        viewerInstance.current.setHoverable({}, true, (atom: any) => {
          if (atom) {
            const label = `${atom.resn} ${atom.resi}\nChain ${atom.chain}`
            viewerInstance.current.addLabel(label, {
              position: atom,
              backgroundColor: 'rgba(0,0,0,0.8)',
              fontColor: 'white',
              fontSize: 12,
              borderRadius: 10,
              padding: 5
            })
          } else {
            viewerInstance.current.removeAllLabels()
          }
          viewerInstance.current.render()
        })

      } catch (error) {
        addLog('error', `Visualization error: ${error}`)
        console.error('Viewer error:', error)
      }
    }

    loadViewer()

    // Cleanup
    return () => {
      if (viewerInstance.current) {
        try {
          viewerInstance.current.clear()
          viewerInstance.current = null
        } catch (error) {
          console.error('Cleanup error:', error)
        }
      }
    }
  }, [proteinData])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (viewerInstance.current) {
        viewerInstance.current.resize()
        viewerInstance.current.render()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading protein structure...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          ref={viewerRef}
          className="w-full h-[500px] bg-white rounded-lg"
          style={{ 
            position: 'relative',
            overflow: 'hidden'
          }}
        />
        {currentProteinId && (
          <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-lg shadow">
            <span className="text-sm font-medium">
              Current Protein: {currentProteinId}
            </span>
          </div>
        )}
      </div>

      {/* Viewer Debug Panel */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Viewer Logs</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-white rounded border border-gray-200 h-40 overflow-y-auto text-sm">
          {logs.length === 0 ? (
            <div className="p-2 text-gray-500 text-center">No viewer logs yet</div>
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