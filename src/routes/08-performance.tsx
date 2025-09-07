import { createFileRoute } from '@tanstack/react-router'
import { useState, useDeferredValue, useTransition, startTransition, useMemo, useCallback, memo } from 'react'

export const Route = createFileRoute('/08-performance')({
  component: RouteComponent,
})

// Heavy computation simulation
function expensiveComputation(value: string, complexity: number): string[] {
  const results: string[] = []
  const iterations = complexity * 1000
  
  for (let i = 0; i < iterations; i++) {
    if (value.toLowerCase().includes('react')) {
      results.push(`React result ${i}: ${value}`)
    }
    if (value.toLowerCase().includes('performance')) {
      results.push(`Performance result ${i}: ${value}`)
    }
    // Simulate more work
    Math.random() * Math.random()
  }
  
  return results.slice(0, 20) // Limit results
}

// Heavy component that causes performance issues
const HeavyList = memo(({ query, complexity }: { query: string; complexity: number }) => {
  console.log('🔄 HeavyList render with:', { query, complexity, timestamp: Date.now() })
  
  const startTime = performance.now()
  const results = useMemo(() => {
    return expensiveComputation(query, complexity)
  }, [query, complexity])
  const endTime = performance.now()
  
  const computationTime = Math.round(endTime - startTime)
  
  return (
    <div className="bg-white p-4 border rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Wyniki wyszukiwania</h3>
        <span className="text-xs text-gray-500">
          Obliczenia: {computationTime}ms
        </span>
      </div>
      
      {results.length === 0 ? (
        <p className="text-gray-500">Brak wyników dla: "{query}"</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

function WithoutDeferredExample() {
  const [query, setQuery] = useState('')
  const [complexity, setComplexity] = useState(1)
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-xl font-semibold text-red-800 mb-4">
        ❌ BEZ useDeferredValue - Blokujące UI
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wyszukaj (spróbuj wpisać "react" lub "performance"):
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wpisz frazę..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="text-xs text-red-600 mt-1">
            ⚠️ UI blokuje się podczas pisania przy wysokiej złożoności
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Złożoność obliczeń: {complexity}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <HeavyList query={query} complexity={complexity} />
      </div>
    </div>
  )
}

function WithDeferredExample() {
  const [query, setQuery] = useState('')
  const [complexity, setComplexity] = useState(1)
  
  // useDeferredValue delays the expensive computation
  const deferredQuery = useDeferredValue(query)
  const deferredComplexity = useDeferredValue(complexity)
  
  const isStale = query !== deferredQuery || complexity !== deferredComplexity
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        ✅ Z useDeferredValue - Płynne UI
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wyszukaj (spróbuj wpisać "react" lub "performance"):
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wpisz frazę..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-green-600 mt-1">
            ✅ UI pozostaje responsywne podczas pisania
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Złożoność obliczeń: {complexity}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className={`transition-opacity ${isStale ? 'opacity-50' : 'opacity-100'}`}>
          {isStale && (
            <div className="mb-2 text-sm text-blue-600 animate-pulse">
              🔄 Aktualizowanie wyników...
            </div>
          )}
          <HeavyList query={deferredQuery} complexity={deferredComplexity} />
        </div>
      </div>
    </div>
  )
}

function TransitionBenchmark() {
  const [items, setItems] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()
  const [renderTime, setRenderTime] = useState<number>(0)
  
  const generateItems = (count: number) => {
    const startTime = performance.now()
    
    startTransition(() => {
      const newItems = Array.from({ length: count }, (_, i) => i + 1)
      setItems(newItems)
      
      // Measure time after render
      setTimeout(() => {
        const endTime = performance.now()
        setRenderTime(Math.round(endTime - startTime))
      }, 0)
    })
  }

  const generateItemsBlocking = (count: number) => {
    const startTime = performance.now()
    const newItems = Array.from({ length: count }, (_, i) => i + 1)
    setItems(newItems)
    
    setTimeout(() => {
      const endTime = performance.now()
      setRenderTime(Math.round(endTime - startTime))
    }, 0)
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Benchmark useTransition</h3>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-semibold mb-2">Z useTransition (non-blocking)</h4>
          <div className="space-x-2">
            {[100, 500, 1000, 2000].map(count => (
              <button
                key={count}
                onClick={() => generateItems(count)}
                disabled={isPending}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {count} items
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Bez useTransition (blocking)</h4>
          <div className="space-x-2">
            {[100, 500, 1000, 2000].map(count => (
              <button
                key={count}
                onClick={() => generateItemsBlocking(count)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                {count} items
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <span>Status: {isPending ? '🔄 Renderowanie...' : '✅ Gotowe'}</span>
          <span>Elementy: {items.length}</span>
          <span>Czas: {renderTime}ms</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto bg-gray-100 p-4 rounded-md">
        <div className="grid grid-cols-10 gap-1">
          {items.map(item => (
            <div 
              key={item} 
              className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-xs text-white"
            >
              {item}
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Kliknij przycisk aby wygenerować elementy
          </p>
        )}
      </div>
    </div>
  )
}

function PerformanceTips() {
  return (
    <div className="max-w-4xl mx-auto bg-blue-50 p-6 border border-blue-200 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        💡 Wskazówki dotyczące wydajności w React 19
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">useDeferredValue</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Używaj dla kosztownych obliczeń podczas wpisywania</li>
            <li>• Idealne dla search, filtering, sorting</li>
            <li>• Pokazuj stale content podczas aktualizacji</li>
            <li>• Lepsza alternatywa dla debounce</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">useTransition</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Używaj dla non-urgent state updates</li>
            <li>• Idealne dla navigation, tab switching</li>
            <li>• Pozwala na pokazanie loading states</li>
            <li>• Nie blokuje krytycznych aktualizacji</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Optymalizacje</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Używaj memo() dla expensive components</li>
            <li>• useMemo() dla kosztownych obliczeń</li>
            <li>• useCallback() dla stable references</li>
            <li>• Profiluj z React DevTools</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Pomiary</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• performance.now() dla precyzyjnych pomiarów</li>
            <li>• console.log() w komponencie dla debug</li>
            <li>• React DevTools Profiler</li>
            <li>• Core Web Vitals w produkcji</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'deferred' | 'transition' | 'tips'>('deferred')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Performance & Benchmarking</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Demonstracja optymalizacji wydajności w React 19 z praktycznymi benchmarkami
          i porównaniami wydajności różnych podejść.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveExample('deferred')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'deferred'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            useDeferredValue
          </button>
          <button
            onClick={() => setActiveExample('transition')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'transition'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            useTransition
          </button>
          <button
            onClick={() => setActiveExample('tips')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'tips'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Wskazówki
          </button>
        </div>
      </div>

      {activeExample === 'deferred' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">
            Porównanie wydajności: z i bez useDeferredValue
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <WithoutDeferredExample />
            <WithDeferredExample />
          </div>
          
          <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Test:</strong> Ustaw złożoność na 8-10 i spróbuj pisać szybko w obu polach. 
              Zauważ różnicę w responsywności UI!
            </p>
          </div>
        </div>
      )}

      {activeExample === 'transition' && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Benchmark useTransition
          </h2>
          <TransitionBenchmark />
        </div>
      )}

      {activeExample === 'tips' && <PerformanceTips />}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe metryki wydajności:</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">📊 Input Responsiveness</h4>
            <p className="text-sm text-gray-700">
              Czas reakcji na interakcje użytkownika. Cel: &lt;16ms dla 60fps.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Render Performance</h4>
            <p className="text-sm text-gray-700">
              Czas potrzebny na re-render komponentów. Mierz z performance.now().
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">⚡ Perceived Performance</h4>
            <p className="text-sm text-gray-700">
              Jak szybka wydaje się aplikacja użytkownikowi. Loading states pomagają.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            <strong>Pro tip:</strong> Otwórz Developer Tools → Console żeby zobaczyć logi 
            renderowania komponentów w czasie rzeczywistym!
          </p>
        </div>
      </div>
    </div>
  )
}