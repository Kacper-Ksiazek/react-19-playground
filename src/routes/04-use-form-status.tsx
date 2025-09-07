import { createFileRoute } from '@tanstack/react-router'
import { FileUploadForm, SearchForm } from '../use-cases/useFormStatus'
import { useState } from 'react'

export const Route = createFileRoute('/04-use-form-status')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'upload' | 'search'>('upload')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">useFormStatus Hook</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Hook <code className="bg-orange-200 px-1 rounded">useFormStatus</code> pozwala na dostęp 
          do informacji o stanie formularza, w tym do danych FormData, metody HTTP i statusu pending.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveExample('upload')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload plików
          </button>
          <button
            onClick={() => setActiveExample('search')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Wyszukiwarka
          </button>
        </div>
      </div>

      {activeExample === 'upload' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 1: Upload plików z statusem</h2>
          <FileUploadForm />
        </div>
      )}

      {activeExample === 'search' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 2: Wyszukiwarka z live status</h2>
          <SearchForm />
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe cechy useFormStatus:</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>pending</strong> - Boolean wskazujący czy formularz jest w trakcie przesyłania</li>
          <li>• <strong>data</strong> - Obiekt FormData z aktualnymi danymi formularza</li>
          <li>• <strong>method</strong> - Metoda HTTP używana do przesyłania (GET, POST, etc.)</li>
          <li>• <strong>action</strong> - URL lub funkcja akcji do której formularz jest przesyłany</li>
          <li>• <strong>Tylko w komponentach potomnych</strong> - Hook musi być używany w komponencie dziecku elementu form</li>
          <li>• <strong>Real-time access</strong> - Dostęp do aktualnych danych formularza w trakcie wprowadzania</li>
        </ul>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Ważne:</strong> useFormStatus można używać tylko w komponentach potomnych elementu &lt;form&gt;. 
            Hook nie działa w tym samym komponencie, w którym znajduje się element form.
          </p>
        </div>
      </div>
    </div>
  )
}
