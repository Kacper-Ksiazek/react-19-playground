import { createFileRoute } from '@tanstack/react-router'
import { RefCleanupExample, RefAsPropExample } from '../use-cases/refs'
import { useState } from 'react'

export const Route = createFileRoute('/06-refs')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'cleanup' | 'props'>('cleanup')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Nowe funkcje Ref w React 19</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          React 19 wprowadza nowe możliwości pracy z refs, w tym funkcje cleanup 
          oraz przekazywanie ref jako zwykłego prop-a.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveExample('cleanup')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'cleanup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ref Cleanup Functions
          </button>
          <button
            onClick={() => setActiveExample('props')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'props'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ref jako Props
          </button>
        </div>
      </div>

      {activeExample === 'cleanup' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">
            Przykład 1: Automatyczne cleanup przy unmount
          </h2>
          <RefCleanupExample />
        </div>
      )}

      {activeExample === 'props' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">
            Przykład 2: Ref jako props vs forwardRef
          </h2>
          <RefAsPropExample />
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Najważniejsze zmiany w React 19:</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">✅ Ref Cleanup Functions</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Callback ref może zwrócić funkcję cleanup</li>
              <li>• Automatyczne wywołanie przy unmount</li>
              <li>• Idealne do czyszczenia event listeners</li>
              <li>• Upraszcza zarządzanie resources</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🆕 Ref jako Props</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Ref można przekazywać jak zwykły prop</li>
              <li>• Mniej potrzeby używania forwardRef</li>
              <li>• Prostszy kod komponentów</li>
              <li>• Zachowana kompatybilność wsteczna</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>Migracja:</strong> Nowe funkcje ref są opcjonalne i w pełni kompatybilne wstecz. 
            Istniejący kod z forwardRef będzie działał bez zmian, ale nowy kod może wykorzystywać prostsze podejście.
          </p>
        </div>
      </div>
    </div>
  )
}
