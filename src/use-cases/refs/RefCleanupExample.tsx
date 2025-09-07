import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

// Przykład cleanup function w ref callback
function RefCleanupExample() {
  const [mounted, setMounted] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const VideoPlayer = () => {
    return (
      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Symulowany odtwarzacz wideo</h3>
        <video
          ref={(element) => {
            if (element) {
              // Setup: inicjalizacja odtwarzacza
              addLog('Video element mounted - inicjalizacja odtwarzacza')
              element.volume = 0.5
              
              // React 19: Cleanup function
              // Zwracana funkcja zostanie wywołana gdy element zostanie unmounted
              return () => {
                addLog('Video element cleanup - zatrzymywanie odtwarzacza')
                element.pause()
                element.currentTime = 0
                // Tutaj moglibyśmy wyczyścić event listeners, timery, itp.
              }
            }
            return undefined
          }}
          className="w-full max-w-sm h-32 bg-black rounded"
          controls
          preload="none"
        >
          <source src="data:video/mp4;base64," type="video/mp4" />
          Twoja przeglądarka nie obsługuje wideo.
        </video>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ref Cleanup Functions</h2>
      <p className="text-gray-600 mb-6">
        W React 19 ref callbacks mogą zwracać funkcję cleanup, która zostanie automatycznie 
        wywołana gdy element zostanie usunięty z DOM.
      </p>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setMounted(!mounted)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {mounted ? 'Usuń' : 'Dodaj'} odtwarzacz
          </button>
          <button
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Wyczyść logi
          </button>
        </div>

        {mounted && <VideoPlayer />}

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Logi lifecycle:</h4>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">Brak logów</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-gray-700 bg-white p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Przykład ref jako props (zastąpienie forwardRef)
interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
}

// W React 19 można przekazywać ref jako zwykły prop
function CustomButton({ children, onClick, ref }: CustomButtonProps) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {children}
    </button>
  )
}

// Dla porównania - stary sposób z forwardRef
const CustomButtonWithForwardRef = forwardRef<HTMLButtonElement, Omit<CustomButtonProps, 'ref'>>(
  ({ children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {children}
      </button>
    )
  }
)

// Przykład z useImperativeHandle
interface CounterRef {
  increment: () => void
  decrement: () => void
  reset: () => void
  getValue: () => number
}

const CounterWithImperativeHandle = forwardRef<CounterRef>((_, ref) => {
  const [count, setCount] = useState(0)

  useImperativeHandle(ref, () => ({
    increment: () => setCount(prev => prev + 1),
    decrement: () => setCount(prev => prev - 1),
    reset: () => setCount(0),
    getValue: () => count,
  }), [count])

  return (
    <div className="p-4 bg-purple-100 rounded-md">
      <p className="text-lg font-semibold">Licznik: {count}</p>
      <p className="text-sm text-gray-600 mt-1">
        Kontrolowany przez ref imperative handle
      </p>
    </div>
  )
})

function RefAsPropExample() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const forwardRefButtonRef = useRef<HTMLButtonElement>(null)
  const counterRef = useRef<CounterRef>(null)
  const [actions, setActions] = useState<string[]>([])

  const addAction = (action: string) => {
    setActions(prev => [...prev, `${new Date().toLocaleTimeString()}: ${action}`])
  }

  const focusButton = (type: 'new' | 'old') => {
    if (type === 'new') {
      buttonRef.current?.focus()
      addAction('Fokus na przycisk (ref as prop)')
    } else {
      forwardRefButtonRef.current?.focus()
      addAction('Fokus na przycisk (forwardRef)')
    }
  }

  const handleCounterAction = (action: 'increment' | 'decrement' | 'reset' | 'getValue') => {
    if (counterRef.current) {
      switch (action) {
        case 'increment': {
          counterRef.current.increment()
          addAction('Counter: increment')
          break
        }
        case 'decrement':
          counterRef.current.decrement()
          addAction('Counter: decrement')
          break
        case 'reset':
          counterRef.current.reset()
          addAction('Counter: reset')
          break
        case 'getValue': {
          const value = counterRef.current.getValue()
          addAction(`Counter: getValue = ${value}`)
          break
        }
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ref as Props vs forwardRef</h2>
      <p className="text-gray-600 mb-6">
        React 19 pozwala na przekazywanie ref jako zwykły prop, 
        eliminując potrzebę używania forwardRef w większości przypadków.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">React 19: Ref jako prop</h3>
          <div className="flex space-x-4 items-center">
            <CustomButton
              ref={buttonRef}
              onClick={() => addAction('Kliknięto przycisk (ref as prop)')}
            >
              Przycisk z ref prop
            </CustomButton>
            <button
              onClick={() => focusButton('new')}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Ustaw fokus
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Tradycyjny sposób: forwardRef</h3>
          <div className="flex space-x-4 items-center">
            <CustomButtonWithForwardRef
              ref={forwardRefButtonRef}
              onClick={() => addAction('Kliknięto przycisk (forwardRef)')}
            >
              Przycisk z forwardRef
            </CustomButtonWithForwardRef>
            <button
              onClick={() => focusButton('old')}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Ustaw fokus
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useImperativeHandle przykład</h3>
          <div className="space-y-3">
            <CounterWithImperativeHandle ref={counterRef} />
            <div className="flex space-x-2">
              <button
                onClick={() => handleCounterAction('increment')}
                className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300"
              >
                +1
              </button>
              <button
                onClick={() => handleCounterAction('decrement')}
                className="px-3 py-1 text-sm bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                -1
              </button>
              <button
                onClick={() => handleCounterAction('reset')}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={() => handleCounterAction('getValue')}
                className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
              >
                Pobierz wartość
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Logi akcji:</h4>
          {actions.length === 0 ? (
            <p className="text-gray-500 text-sm">Brak akcji</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {actions.map((action, index) => (
                <div key={index} className="text-sm font-mono text-gray-700 bg-white p-2 rounded">
                  {action}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setActions([])}
            className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Wyczyść logi
          </button>
        </div>
      </div>
    </div>
  )
}

export { RefCleanupExample, RefAsPropExample }