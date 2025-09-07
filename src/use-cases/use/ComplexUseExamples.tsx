import { use, useState, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// Enhanced data fetching utilities with cache
interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

interface UserProfile {
  id: number
  name: string
  avatar: string
  email: string
  posts: number
  followers: number
}

// Enhanced cache implementation with error handling
const cache = new Map<string, Promise<unknown>>()

function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    console.log(`🔄 Creating new cache entry for: ${key}`)
    const promise = fetcher()
    
    // Cache both success and failure - no retry logic
    promise.catch((error) => {
      console.log(`❌ Caching failed response for: ${key}`, error.message)
    })
    
    cache.set(key, promise)
  } else {
    console.log(`✅ Using cached entry for: ${key}`)
  }
  return cache.get(key)! as Promise<T>
}

// Weather API simulation
async function fetchWeatherData(location: string): Promise<WeatherData> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const shouldFail = Math.random() < 0.4
  console.log(`🌤️ Weather API for ${location}: shouldFail=${shouldFail}`)
  
  if (shouldFail) {
    console.error(`❌ Weather API failed for ${location}`)
    throw new Error(`Nie udało się pobrać danych pogodowych dla ${location}`)
  }

  const conditions = ['słonecznie', 'pochmurno', 'deszczowo', 'śnieżnie', 'mgliście']
  
  return {
    location,
    temperature: Math.round(Math.random() * 40 - 10),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.round(Math.random() * 100),
    windSpeed: Math.round(Math.random() * 30)
  }
}

// User profile API simulation
async function fetchUserProfile(userId: number): Promise<UserProfile> {
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const shouldFail = Math.random() < 0.35
  console.log(`👤 User API for ${userId}: shouldFail=${shouldFail}`)
  
  if (shouldFail) {
    console.error(`❌ User API failed for ${userId}`)
    throw new Error(`Nie udało się pobrać profilu użytkownika ${userId}`)
  }

  return {
    id: userId,
    name: `Użytkownik ${userId}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    email: `user${userId}@example.com`,
    posts: Math.round(Math.random() * 100),
    followers: Math.round(Math.random() * 1000)
  }
}

// Weather component using 'use' with cache
function WeatherWidget({ location }: { location: string }) {
  const weatherData = use(fetchWithCache(`weather-${location}`, () => fetchWeatherData(location)))

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="font-semibold text-blue-800 mb-2">🌤️ Pogoda w {weatherData.location}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><strong>Temperatura:</strong> {weatherData.temperature}°C</div>
        <div><strong>Warunki:</strong> {weatherData.condition}</div>
        <div><strong>Wilgotność:</strong> {weatherData.humidity}%</div>
        <div><strong>Wiatr:</strong> {weatherData.windSpeed} km/h</div>
      </div>
    </div>
  )
}

// User profile component
function UserProfileCard({ userId }: { userId: number }) {
  const profile = use(fetchWithCache(`user-${userId}`, () => fetchUserProfile(userId)))

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center space-x-3 mb-3">
        <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-semibold text-green-800">{profile.name}</h3>
          <p className="text-sm text-green-600">{profile.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><strong>Posty:</strong> {profile.posts}</div>
        <div><strong>Obserwujący:</strong> {profile.followers}</div>
      </div>
    </div>
  )
}

// Combined dashboard component
function UserDashboard({ userId, location }: { userId: number; location: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dashboard użytkownika</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <ErrorBoundary
          key={`user-${userId}`}
          fallback={<div className="p-4 bg-red-100 text-red-800 rounded-md">Błąd ładowania profilu użytkownika {userId}</div>}
        >
          <Suspense fallback={<div className="p-4 bg-gray-100 animate-pulse rounded-md">Ładowanie profilu...</div>}>
            <UserProfileCard userId={userId} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          key={`weather-${location}`}
          fallback={<div className="p-4 bg-red-100 text-red-800 rounded-md">Błąd ładowania pogody dla {location}</div>}
        >
          <Suspense fallback={<div className="p-4 bg-gray-100 animate-pulse rounded-md">Ładowanie pogody...</div>}>
            <WeatherWidget location={location} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

// Main complex use example component
export function ComplexUseExamples() {
  const [selectedUser, setSelectedUser] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState('Warszawa')

  const clearCache = () => {
    cache.clear()
    // Force re-render
    setSelectedUser(prev => prev)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zaawansowane przykłady 'use'</h2>
      <p className="text-gray-600 mb-6">
        Demonstracja równoległego ładowania danych z różnych źródeł, cache'owania i obsługi błędów.
      </p>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Użytkownik:
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map(id => (
                <option key={id} value={id}>Użytkownik {id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokalizacja:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearCache}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Wyczyść cache
          </button>
        </div>

        <UserDashboard userId={selectedUser} location={selectedLocation} />

        <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-md">
          <h4 className="font-semibold text-yellow-800 mb-2">Funkcje demonstrowane:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Równoległe ładowanie:</strong> Profile użytkownika i pogoda ładują się jednocześnie</li>
            <li>• <strong>Persistent cache:</strong> Zarówno sukces jak i błąd są cache'owane na stałe</li>
            <li>• <strong>Obsługa błędów:</strong> ErrorBoundary wyłapuje błędy z poszczególnych komponentów</li>
            <li>• <strong>Trwałe błędy:</strong> Raz nieudane zapytanie pozostaje nieudane (bez retry)</li>
            <li>• <strong>Suspense:</strong> Każdy komponent może mieć własny stan ładowania</li>
            <li>• <strong>Cache consistency:</strong> Identyczne zapytania zawsze zwracają ten sam wynik</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-semibold text-gray-700 mb-2">Cache status:</h4>
          <div className="text-sm text-gray-600">
            <p><strong>Wpisy w cache:</strong> {cache.size}</p>
            <p><strong>Klucze:</strong> {Array.from(cache.keys()).join(', ') || 'Brak'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Conditional use example - showing use in loops and conditions
export function ConditionalUseExample() {
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(['weather'])
  const [locations] = useState(['Warszawa', 'Kraków', 'Gdańsk'])

  const toggleWidget = (widget: string) => {
    setEnabledWidgets(prev => 
      prev.includes(widget)
        ? prev.filter(w => w !== widget)
        : [...prev, widget]
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Warunkowe użycie 'use'</h2>
      <p className="text-gray-600 mb-6">
        Przykład użycia 'use' w pętlach i warunkach - React 19 pozwala na elastyczne użycie hooków.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Włączone widgety:</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabledWidgets.includes('weather')}
                onChange={() => toggleWidget('weather')}
                className="mr-2"
              />
              Pogoda
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabledWidgets.includes('users')}
                onChange={() => toggleWidget('users')}
                className="mr-2"
              />
              Użytkownicy
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {enabledWidgets.includes('weather') && (
            <div>
              <h3 className="font-semibold mb-2">Pogoda w różnych miastach:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {locations.map(location => (
                  <ErrorBoundary
                    key={location}
                    fallback={<div className="p-4 bg-red-100 text-red-800 rounded-md">Błąd: {location}</div>}
                  >
                    <Suspense fallback={<div className="p-4 bg-gray-100 animate-pulse rounded-md">Ładowanie {location}...</div>}>
                      <WeatherWidget location={location} />
                    </Suspense>
                  </ErrorBoundary>
                ))}
              </div>
            </div>
          )}

          {enabledWidgets.includes('users') && (
            <div>
              <h3 className="font-semibold mb-2">Profile użytkowników:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(userId => (
                  <ErrorBoundary
                    key={userId}
                    fallback={<div className="p-4 bg-red-100 text-red-800 rounded-md">Błąd: Użytkownik {userId}</div>}
                  >
                    <Suspense fallback={<div className="p-4 bg-gray-100 animate-pulse rounded-md">Ładowanie użytkownika...</div>}>
                      <UserProfileCard userId={userId} />
                    </Suspense>
                  </ErrorBoundary>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 border border-blue-200 rounded-md">
          <h4 className="font-semibold text-blue-800 mb-2">Zaawansowane wzorce:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Use w mapowaniu:</strong> Każdy element listy może używać 'use' niezależnie</li>
            <li>• <strong>Warunkowe ładowanie:</strong> Komponenty ładują dane tylko gdy są potrzebne</li>
            <li>• <strong>Izolowane błędy:</strong> Błąd w jednym komponencie nie wpływa na inne</li>
            <li>• <strong>Równoległe przetwarzanie:</strong> Wszystkie 'use' wywołania działają jednocześnie</li>
          </ul>
        </div>
      </div>
    </div>
  )
}