import { useFormStatus, useActionState } from 'react'

interface SearchResult {
  id: number
  title: string
  description: string
  category: string
}

interface SearchState {
  results: SearchResult[]
  query: string
  totalResults: number
  isSearching: boolean
  error?: string
}

const initialState: SearchState = {
  results: [],
  query: '',
  totalResults: 0,
  isSearching: false
}

// Symulowane dane do wyszukiwania
const mockData: SearchResult[] = [
  { id: 1, title: 'React 19 - nowe funkcje', description: 'Przewodnik po najnowszych funkcjach React 19', category: 'Frontend' },
  { id: 2, title: 'TypeScript w praktyce', description: 'Zaawansowane techniki TypeScript', category: 'Development' },
  { id: 3, title: 'Next.js 14 tutorial', description: 'Kompletny przewodnik po Next.js', category: 'Framework' },
  { id: 4, title: 'CSS Grid vs Flexbox', description: 'Porównanie układów CSS', category: 'CSS' },
  { id: 5, title: 'Node.js performance', description: 'Optymalizacja aplikacji Node.js', category: 'Backend' },
  { id: 6, title: 'React hooks deep dive', description: 'Szczegółowy przewodnik po hookach', category: 'Frontend' },
  { id: 7, title: 'GraphQL podstawy', description: 'Wprowadzenie do GraphQL', category: 'API' },
  { id: 8, title: 'Docker dla deweloperów', description: 'Konteneryzacja aplikacji', category: 'DevOps' },
]

async function searchAction(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = (formData.get('query') as string).toLowerCase().trim()
  const category = formData.get('category') as string
  
  if (!query) {
    return {
      ...initialState,
      error: 'Wprowadź frazę do wyszukania'
    }
  }

  // Symulacja opóźnienia wyszukiwania
  await new Promise(resolve => setTimeout(resolve, 800))

  // Symulacja błędu sieciowego w 10% przypadków
  if (Math.random() < 0.1) {
    return {
      ...prevState,
      error: 'Błąd połączenia. Spróbuj ponownie.',
      isSearching: false
    }
  }

  let results = mockData.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )

  // Filtrowanie po kategorii jeśli wybrana
  if (category && category !== 'all') {
    results = results.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    )
  }

  return {
    results,
    query,
    totalResults: results.length,
    isSearching: false,
    error: undefined
  }
}

function SearchButton() {
  const { pending, data } = useFormStatus()
  const query = data?.get('query') as string
  const category = data?.get('category') as string

  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={pending || !query?.trim()}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          pending || !query?.trim()
            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
            : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {pending ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Wyszukiwanie...</span>
          </div>
        ) : (
          'Szukaj'
        )}
      </button>

      {pending && query && (
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm text-blue-800">
            <p><strong>Szukam:</strong> "{query}"</p>
            {category && category !== 'all' && (
              <p><strong>Kategoria:</strong> {category}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SearchResults({ state }: { state: SearchState }) {
  if (state.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">{state.error}</p>
      </div>
    )
  }

  if (state.query && state.totalResults === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">
          Nie znaleziono wyników dla frazy: <strong>"{state.query}"</strong>
        </p>
      </div>
    )
  }

  if (state.results.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Wyniki wyszukiwania
          </h3>
          <span className="text-sm text-gray-600">
            Znaleziono: {state.totalResults} wyników
          </span>
        </div>
        
        <div className="space-y-3">
          {state.results.map((result) => (
            <div key={result.id} className="p-4 bg-gray-50 border rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{result.title}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {result.category}
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function SearchForm() {
  const [state, action] = useActionState(searchAction, initialState)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Wyszukiwarka artykułów</h2>
      
      <form action={action} className="space-y-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Fraza do wyszukania
            </label>
            <input
              type="text"
              id="query"
              name="query"
              placeholder="np. React hooks, TypeScript..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategoria
            </label>
            <select
              id="category"
              name="category"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="framework">Framework</option>
              <option value="css">CSS</option>
              <option value="api">API</option>
              <option value="devops">DevOps</option>
              <option value="development">Development</option>
            </select>
          </div>
        </div>

        <SearchButton />
      </form>

      <SearchResults state={state} />

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Stan wyszukiwania:</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(
            { 
              query: state.query, 
              totalResults: state.totalResults, 
              isSearching: state.isSearching,
              hasError: !!state.error 
            }, 
            null, 
            2
          )}
        </pre>
      </div>
    </div>
  )
}