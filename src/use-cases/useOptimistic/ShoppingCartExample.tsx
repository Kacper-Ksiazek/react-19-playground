import { useOptimistic, useTransition, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface CartItem extends Product {
  quantity: number
  cartId: string
}

interface OptimisticCartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction = 
  | { type: 'add'; product: Product }
  | { type: 'remove'; cartId: string }
  | { type: 'updateQuantity'; cartId: string; quantity: number }
  | { type: 'clear' }

// Mock products
const mockProducts: Product[] = [
  { id: 1, name: 'MacBook Pro M3', price: 8999, image: '💻', category: 'Elektronika' },
  { id: 2, name: 'iPhone 15 Pro', price: 5499, image: '📱', category: 'Telefony' },
  { id: 3, name: 'AirPods Pro', price: 1299, image: '🎧', category: 'Audio' },
  { id: 4, name: 'iPad Air', price: 2999, image: '📟', category: 'Tablety' },
  { id: 5, name: 'Apple Watch Ultra', price: 3999, image: '⌚', category: 'Wearables' },
  { id: 6, name: 'Magic Keyboard', price: 599, image: '⌨️', category: 'Akcesoria' },
]

// Simulated API calls with configurable failure rates
async function addToCartAPI(product: Product, failureRate: number): Promise<CartItem> {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
  
  if (Math.random() < (failureRate / 100)) {
    throw new Error(`Nie udało się dodać ${product.name} do koszyka. Produkt może być niedostępny.`)
  }

  return {
    ...product,
    quantity: 1,
    cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

async function updateQuantityAPI(failureRate: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800))
  
  if (Math.random() < (failureRate / 100)) {
    throw new Error('Nie udało się zaktualizować ilości')
  }
}

async function removeFromCartAPI(failureRate: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600))
  
  if (Math.random() < (failureRate / 100)) {
    throw new Error('Nie udało się usunąć produktu z koszyka')
  }
}

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function optimisticCartReducer(state: OptimisticCartState, action: CartAction): OptimisticCartState {
  let newItems: CartItem[]
  
  switch (action.type) {
    case 'add': {
      // Check if product already exists
      const existingItemIndex = state.items.findIndex(item => item.id === action.product.id)
      
      if (existingItemIndex >= 0) {
        newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        }
      } else {
        newItems = [...state.items, {
          ...action.product,
          quantity: 1,
          cartId: `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]
      }
      break
    }
      
    case 'remove':
      newItems = state.items.filter(item => item.cartId !== action.cartId)
      break
      
    case 'updateQuantity':
      newItems = state.items.map(item => 
        item.cartId === action.cartId 
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      break
      
    case 'clear':
      newItems = []
      break
      
    default:
      return state
  }

  const { total, itemCount } = calculateCartTotals(newItems)
  return { items: newItems, total, itemCount }
}

export function ShoppingCartExample() {
  const [actualCart, setActualCart] = useState<OptimisticCartState>({
    items: [],
    total: 0,
    itemCount: 0
  })
  
  const [optimisticCart, addOptimistic] = useOptimistic(
    actualCart,
    optimisticCartReducer
  )
  
  const [isPending, startTransition] = useTransition()
  const [failureRate, setFailureRate] = useState(35) // Default 35% failure rate

  const addToCart = async (product: Product) => {
    startTransition(async () => {
      // Optimistic update
      addOptimistic({ type: 'add', product })
      
      try {
        const cartItem = await addToCartAPI(product, failureRate)
        
        // Update actual state with server response
        setActualCart(prev => {
          const existingItemIndex = prev.items.findIndex(item => item.id === product.id)
          let newItems: CartItem[]
          
          if (existingItemIndex >= 0) {
            newItems = [...prev.items]
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + 1,
              cartId: cartItem.cartId // Use server-generated ID
            }
          } else {
            newItems = [...prev.items, cartItem]
          }
          
          const { total, itemCount } = calculateCartTotals(newItems)
          return { items: newItems, total, itemCount }
        })
        
        toast.success(`✅ ${product.name} został dodany do koszyka!`, {
          position: "bottom-right",
          autoClose: 3000,
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd'
        toast.error(`❌ ${errorMsg}`, {
          position: "bottom-right",
          autoClose: 4000,
        })
        // Optimistic update will be reverted automatically
      }
    })
  }

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    startTransition(async () => {
      // Optimistic update
      addOptimistic({ type: 'updateQuantity', cartId, quantity: newQuantity })
      
      try {
        await updateQuantityAPI(failureRate)
        
        // Update actual state
        setActualCart(prev => {
          const newItems = prev.items.map(item => 
            item.cartId === cartId 
              ? { ...item, quantity: Math.max(0, newQuantity) }
              : item
          ).filter(item => item.quantity > 0)
          
          const { total, itemCount } = calculateCartTotals(newItems)
          return { items: newItems, total, itemCount }
        })
        
        if (newQuantity === 0) {
          toast.success('🗑️ Produkt został usunięty z koszyka', {
            position: "bottom-right",
            autoClose: 2000,
          })
        } else {
          toast.success('🔄 Ilość została zaktualizowana', {
            position: "bottom-right",
            autoClose: 2000,
          })
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd'
        toast.error(`❌ ${errorMsg}`, {
          position: "bottom-right",
          autoClose: 4000,
        })
      }
    })
  }

  const removeFromCart = async (cartId: string) => {
    startTransition(async () => {
      // Optimistic update
      addOptimistic({ type: 'remove', cartId })
      
      try {
        await removeFromCartAPI(failureRate)
        
        // Update actual state
        setActualCart(prev => {
          const newItems = prev.items.filter(item => item.cartId !== cartId)
          const { total, itemCount } = calculateCartTotals(newItems)
          return { items: newItems, total, itemCount }
        })
        
        toast.success('🗑️ Produkt został usunięty z koszyka', {
          position: "bottom-right",
          autoClose: 2000,
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd'
        toast.error(`❌ ${errorMsg}`, {
          position: "bottom-right",
          autoClose: 4000,
        })
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <h2 className="text-3xl font-bold text-center mb-8">Sklep z useOptimistic</h2>
      
      {/* Failure Rate Control - Floating */}
      <div className="fixed top-4 right-4 z-50 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Błędy API:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={failureRate}
              onChange={(e) => setFailureRate(Number(e.target.value))}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${100-failureRate}%, #ef4444 ${100-failureRate}%, #ef4444 100%)`
              }}
            />
            <span className="text-sm font-mono text-gray-900 min-w-[40px] text-right">
              {failureRate}%
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {failureRate === 0 && '✅ Wszystkie operacje będą udane'}
          {failureRate > 0 && failureRate <= 20 && '🟢 Rzadkie błędy'}
          {failureRate > 20 && failureRate <= 50 && '🟡 Umiarkowane błędy'}
          {failureRate > 50 && failureRate <= 80 && '🟠 Częste błędy'}
          {failureRate > 80 && '🔴 Bardzo częste błędy'}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Dostępne produkty</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {mockProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-blue-600 mb-3">{product.price.toLocaleString('pl-PL')} zł</p>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={isPending}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      isPending
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isPending ? 'Dodawanie...' : 'Dodaj do koszyka'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Koszyk</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {optimisticCart.itemCount} {optimisticCart.itemCount === 1 ? 'produkt' : 'produkty'}
                </span>
              </div>

              {optimisticCart.items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Koszyk jest pusty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {optimisticCart.items.map((item) => (
                      <div key={item.cartId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        <div className="text-2xl">{item.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.price.toLocaleString('pl-PL')} zł</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            disabled={isPending}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            disabled={isPending}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            disabled={isPending}
                            className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold mb-4">
                      <span>Razem:</span>
                      <span className="text-blue-600">
                        {optimisticCart.total.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                    
                    <button
                      disabled={isPending || optimisticCart.items.length === 0}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        isPending || optimisticCart.items.length === 0
                          ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isPending ? 'Przetwarzanie...' : 'Przejdź do płatności'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Debug useOptimistic:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>isPending:</strong> {isPending.toString()}</div>
                <div><strong>Optimistic items:</strong> {optimisticCart.items.length}</div>
                <div><strong>Actual items:</strong> {actualCart.items.length}</div>
                <div><strong>Optimistic total:</strong> {optimisticCart.total.toLocaleString('pl-PL')} zł</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-4 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">Funkcje demonstrowane:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Optymistyczne aktualizacje:</strong> Koszyk aktualizuje się natychmiast</li>
          <li>• <strong>Automatyczny rollback:</strong> Jeśli operacja się nie powiedzie, zmiany są cofane</li>
          <li>• <strong>Równoległe operacje:</strong> Możliwość wykonywania wielu operacji jednocześnie</li>
          <li>• <strong>Konfigurowalny failure rate:</strong> Użyj suwaka w prawym górnym rogu (domyślnie {failureRate}%)</li>
          <li>• <strong>Toast notifications:</strong> React-toastify dla eleganckiej obsługi komunikatów</li>
          <li>• <strong>Realistic delays:</strong> Symulacja rzeczywistych opóźnień API (400-2000ms)</li>
        </ul>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}