import { useActionState } from 'react'

interface MultiStepState {
  step: number
  formData: {
    personalInfo?: {
      firstName: string
      lastName: string
      email: string
    }
    preferences?: {
      newsletter: boolean
      theme: 'light' | 'dark'
      language: string
    }
    completion?: {
      termsAccepted: boolean
    }
  }
  errors: Record<string, string>
  isComplete: boolean
}

const initialState: MultiStepState = {
  step: 1,
  formData: {},
  errors: {},
  isComplete: false
}

async function multiStepFormAction(
  prevState: MultiStepState,
  formData: FormData
): Promise<MultiStepState> {
  const action = formData.get('action') as string
  
  if (action === 'next') {
    return handleNextStep(prevState, formData)
  } else if (action === 'prev') {
    return handlePrevStep(prevState)
  } else if (action === 'complete') {
    return handleComplete(prevState, formData)
  }
  
  return prevState
}

async function handleNextStep(
  prevState: MultiStepState,
  formData: FormData
): Promise<MultiStepState> {
  await new Promise(resolve => setTimeout(resolve, 500))

  const errors: Record<string, string> = {}
  let newFormData = { ...prevState.formData }

  if (prevState.step === 1) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string

    if (!firstName) errors.firstName = 'Imię jest wymagane'
    if (!lastName) errors.lastName = 'Nazwisko jest wymagane'
    if (!email || !email.includes('@')) errors.email = 'Podaj prawidłowy email'

    if (Object.keys(errors).length === 0) {
      newFormData.personalInfo = { firstName, lastName, email }
    }
  } else if (prevState.step === 2) {
    const newsletter = formData.get('newsletter') === 'on'
    const theme = formData.get('theme') as 'light' | 'dark'
    const language = formData.get('language') as string

    if (!theme) errors.theme = 'Wybierz motyw'
    if (!language) errors.language = 'Wybierz język'

    if (Object.keys(errors).length === 0) {
      newFormData.preferences = { newsletter, theme, language }
    }
  }

  return {
    ...prevState,
    step: Object.keys(errors).length === 0 ? prevState.step + 1 : prevState.step,
    formData: newFormData,
    errors
  }
}

async function handlePrevStep(prevState: MultiStepState): Promise<MultiStepState> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    ...prevState,
    step: Math.max(1, prevState.step - 1),
    errors: {}
  }
}

async function handleComplete(
  prevState: MultiStepState,
  formData: FormData
): Promise<MultiStepState> {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const termsAccepted = formData.get('termsAccepted') === 'on'
  const errors: Record<string, string> = {}

  if (!termsAccepted) {
    errors.termsAccepted = 'Musisz zaakceptować warunki'
  }

  if (Object.keys(errors).length > 0) {
    return { ...prevState, errors }
  }

  return {
    ...prevState,
    formData: {
      ...prevState.formData,
      completion: { termsAccepted }
    },
    isComplete: true,
    errors: {}
  }
}

export function MultiStepForm() {
  const [state, action, isPending] = useActionState(multiStepFormAction, initialState)

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Krok 1: Informacje osobiste</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię *
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={state.formData.personalInfo?.firstName}
                disabled={isPending}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  state.errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {state.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko *
              </label>
              <input
                type="text"
                name="lastName"
                defaultValue={state.formData.personalInfo?.lastName}
                disabled={isPending}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  state.errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {state.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                defaultValue={state.formData.personalInfo?.email}
                disabled={isPending}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  state.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {state.errors.email && (
                <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Krok 2: Preferencje</h3>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="newsletter"
                  defaultChecked={state.formData.preferences?.newsletter}
                  disabled={isPending}
                  className="mr-2"
                />
                Chcę otrzymywać newsletter
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motyw *
              </label>
              <select
                name="theme"
                defaultValue={state.formData.preferences?.theme || ''}
                disabled={isPending}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  state.errors.theme ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Wybierz motyw</option>
                <option value="light">Jasny</option>
                <option value="dark">Ciemny</option>
              </select>
              {state.errors.theme && (
                <p className="text-red-500 text-sm mt-1">{state.errors.theme}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Język *
              </label>
              <select
                name="language"
                defaultValue={state.formData.preferences?.language || ''}
                disabled={isPending}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  state.errors.language ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Wybierz język</option>
                <option value="pl">Polski</option>
                <option value="en">Angielski</option>
                <option value="de">Niemiecki</option>
              </select>
              {state.errors.language && (
                <p className="text-red-500 text-sm mt-1">{state.errors.language}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Krok 3: Potwierdzenie</h3>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Podsumowanie:</h4>
              <p><strong>Imię:</strong> {state.formData.personalInfo?.firstName}</p>
              <p><strong>Nazwisko:</strong> {state.formData.personalInfo?.lastName}</p>
              <p><strong>Email:</strong> {state.formData.personalInfo?.email}</p>
              <p><strong>Newsletter:</strong> {state.formData.preferences?.newsletter ? 'Tak' : 'Nie'}</p>
              <p><strong>Motyw:</strong> {state.formData.preferences?.theme === 'light' ? 'Jasny' : 'Ciemny'}</p>
              <p><strong>Język:</strong> {state.formData.preferences?.language}</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  disabled={isPending}
                  className="mr-2"
                />
                Akceptuję warunki korzystania z serwisu *
              </label>
              {state.errors.termsAccepted && (
                <p className="text-red-500 text-sm mt-1">{state.errors.termsAccepted}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (state.isComplete) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejestracja zakończona!</h2>
          <p className="text-gray-600 mb-4">Twoje konto zostało pomyślnie utworzone.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Zarejestruj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Rejestracja</h2>
          <span className="text-sm text-gray-500">Krok {state.step} z 3</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(state.step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form action={action} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between">
          {state.step > 1 && (
            <button
              type="submit"
              name="action"
              value="prev"
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Wstecz
            </button>
          )}

          <div className="ml-auto">
            {state.step < 3 ? (
              <button
                type="submit"
                name="action"
                value="next"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? 'Sprawdzanie...' : 'Dalej'}
              </button>
            ) : (
              <button
                type="submit"
                name="action"
                value="complete"
                disabled={isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isPending ? 'Rejestrowanie...' : 'Zakończ rejestrację'}
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Stan formularza:</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify({ step: state.step, isPending, errors: state.errors }, null, 2)}
        </pre>
      </div>
    </div>
  )
}