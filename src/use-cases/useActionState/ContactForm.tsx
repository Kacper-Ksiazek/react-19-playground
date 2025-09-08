import { useActionState, startTransition } from 'react'

interface ContactFormState {
  success: boolean
  errors: {
    name?: string
    email?: string
    message?: string
  }
  message?: string
}

const initialState: ContactFormState = {
  success: false,
  errors: {}
}

async function contactFormAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  await new Promise(resolve => setTimeout(resolve, 1500))

  const errors: { name?: string; email?: string; message?: string } = {}

  if (!name || name.length < 2) {
    errors.name = 'Imię musi mieć co najmniej 2 znaki'
  }

  if (!email || !email.includes('@')) {
    errors.email = 'Podaj prawidłowy adres email'
  }

  if (!message || message.length < 10) {
    errors.message = 'Wiadomość musi mieć co najmniej 10 znaków'
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Popraw błędy i spróbuj ponownie'
    }
  }

  if (Math.random() < 0.3) {
    return {
      success: false,
      errors: {},
      message: 'Wystąpił błąd serwera. Spróbuj ponownie.'
    }
  }

  return {
    success: true,
    errors: {},
    message: 'Wiadomość została wysłana pomyślnie!'
  }
}

export function ContactForm() {
  const [state, action, isPending] = useActionState(contactFormAction, initialState)

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      action(formData)
    })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Formularz kontaktowy</h2>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Imię *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            disabled={isPending}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
              state.errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Wpisz swoje imię"
          />
          {state.errors.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            disabled={isPending}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
              state.errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="twoj@email.com"
          />
          {state.errors.email && (
            <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Wiadomość *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled={isPending}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
              state.errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Wpisz swoją wiadomość..."
          />
          {state.errors.message && (
            <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isPending
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isPending ? 'Wysyłanie...' : 'Wyślij wiadomość'}
        </button>

        {state.message && (
          <div
            className={`p-3 rounded-md ${
              state.success
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {state.message}
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Stan formularza:</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify({ state, isPending }, null, 2)}
        </pre>
      </div>
    </div>
  )
}