import { createFileRoute } from '@tanstack/react-router'
import { UseCase1, ShoppingCartExample } from '../use-cases/useOptimistic'
import { useState } from 'react'

export const Route = createFileRoute('/02-use-optimistic')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeExample, setActiveExample] = useState<'basic' | 'shopping'>('basic')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">useOptimistic Hook</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Hook <code className="bg-orange-200 px-1 rounded">useOptimistic</code> pozwala na 
          optymistyczne aktualizacje interfejsu przed potwierdzeniem operacji przez serwer.
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
            Podstawowy przykład
          </button>
          <button
            onClick={() => setActiveExample('shopping')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeExample === 'shopping'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Koszyk sklepu
          </button>
        </div>
      </div>

      {activeExample === 'basic' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 1: Aktualizacja nazwy</h2>
          <UseCase1 />
        </div>
      )}

      {activeExample === 'shopping' && (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Przykład 2: Zaawansowany koszyk sklepu</h2>
          <ShoppingCartExample />
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe cechy useOptimistic:</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">✅ Natychmiastowe UI</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Interfejs aktualizuje się bez opóźnień</li>
              <li>• Lepsza responsywność aplikacji</li>
              <li>• Płynne user experience</li>
              <li>• Redukcja perceived latency</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🔄 Automatyczny rollback</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Cofanie zmian przy błędach</li>
              <li>• Graceful error handling</li>
              <li>• Zachowana spójność danych</li>
              <li>• Transparent dla użytkownika</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>Gdy używać:</strong> useOptimistic jest idealny dla operacji, które prawdopodobnie 
            zakończą się sukcesem (np. dodawanie komentarzy, like'owanie, operacje CRUD).
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Uwaga:</strong> Przykład koszyka ma ~15% wskaźnik niepowodzeń aby zademonstrować 
            automatyczny rollback. W rzeczywistych aplikacjach ten wskaźnik powinien być znacznie niższy.
          </p>
        </div>
      </div>
    </div>
  )
}
