import { createFileRoute } from '@tanstack/react-router'
import { SimpleSampleContext } from '../context/SimpleSampleContext'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UseCase1, UseCase2, ComplexUseExamples, ConditionalUseExample } from '../use-cases/use'

export const Route = createFileRoute('/01-use')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'basic' | 'complex' | 'conditional'>('basic')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Funkcja 'use' w React 19</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Funkcja <code className="bg-orange-200 px-1 rounded">use</code> pozwala na odczytywanie 
          zasobów takich jak Promises i Context bezpośrednio w komponentach.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveExample('basic')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Podstawowe użycie
          </button>
          <button
            onClick={() => setActiveExample('complex')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'complex'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Zaawansowane przykłady
          </button>
          <button
            onClick={() => setActiveExample('conditional')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'conditional'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Warunkowe użycie
          </button>
        </div>
      </div>

      {activeExample === 'basic' && (
        <SimpleSampleContext value={{ bestJavascriptFramework: 'Svelte' }}>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-4">Podstawowe przykłady 'use'</h2>
            <UseCase1 />
            {/* <UseCase1 isStillLoading /> */}
            {/* <UseCase2 /> */}
          </div>
        </SimpleSampleContext>
      )}

      {activeExample === 'complex' && <ComplexUseExamples />}
      {activeExample === 'conditional' && <ConditionalUseExample />}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe cechy funkcji 'use':</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">✅ Promises</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Odczytywanie Promise bezpośrednio w render</li>
              <li>• Automatyczne Suspense gdy Promise pending</li>
              <li>• Throw error gdy Promise rejected</li>
              <li>• Cache'owanie dla wydajności</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Context</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Alternatywa dla useContext</li>
              <li>• Można używać w warunkach i pętlach</li>
              <li>• Prostsze API</li>
              <li>• Kompatybilność z istniejącym kodem</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>Różnice od hooków:</strong> Funkcja 'use' nie jest hookiem - może być używana 
            w warunkach, pętlach i innych miejscach gdzie hooks nie są dozwolone.
          </p>
        </div>
      </div>
    </div>
  )
}
