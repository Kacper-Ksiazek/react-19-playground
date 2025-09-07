import { createFileRoute } from '@tanstack/react-router'
import { ContactForm, MultiStepForm } from '../use-cases/useActionState'
import { useState } from 'react'

export const Route = createFileRoute('/05-use-action-state')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'contact' | 'multistep'>('contact')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">useActionState Hook</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Hook <code className="bg-orange-200 px-1 rounded">useActionState</code> pozwala na zarządzanie stanem formularzy 
          z automatyczną obsługą akcji asynchronicznych, walidacji i stanów ładowania.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveExample('contact')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'contact'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Formularz kontaktowy
          </button>
          <button
            onClick={() => setActiveExample('multistep')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'multistep'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Formularz wieloetapowy
          </button>
        </div>
      </div>

      {activeExample === 'contact' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 1: Prosty formularz z walidacją</h2>
          <ContactForm />
        </div>
      )}

      {activeExample === 'multistep' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 2: Formularz wieloetapowy</h2>
          <MultiStepForm />
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe cechy useActionState:</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>Automatyczne zarządzanie stanem</strong> - Hook automatycznie śledzi stan formularza i błędy</li>
          <li>• <strong>Obsługa asynchronicznych akcji</strong> - Wspiera operacje async/await z automatycznym stanem ładowania</li>
          <li>• <strong>Integracja z formularzami</strong> - Bezpośrednio współpracuje z HTML formami i FormData</li>
          <li>• <strong>Optymistyczne aktualizacje</strong> - Może być używany z useOptimistic dla lepszego UX</li>
          <li>• <strong>Walidacja po stronie klienta</strong> - Obsługuje walidację i wyświetlanie błędów</li>
          <li>• <strong>Stany pendingu</strong> - Automatyczne śledzenie stanu ładowania podczas wykonywania akcji</li>
        </ul>
      </div>
    </div>
  )
}
