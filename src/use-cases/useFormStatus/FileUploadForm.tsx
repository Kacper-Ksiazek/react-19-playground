import { useFormStatus, useActionState } from 'react'

interface FileUploadState {
  success: boolean
  error?: string
  fileName?: string
  fileSize?: number
  uploadProgress?: number
}

const initialState: FileUploadState = {
  success: false
}

async function fileUploadAction(
  prevState: FileUploadState,
  formData: FormData
): Promise<FileUploadState> {
  const file = formData.get('file') as File
  
  if (!file || file.size === 0) {
    return {
      success: false,
      error: 'Proszę wybrać plik do przesłania'
    }
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return {
      success: false,
      error: 'Plik jest za duży. Maksymalny rozmiar to 5MB.'
    }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Nieobsługiwany typ pliku. Dozwolone: JPG, PNG, GIF, PDF, TXT'
    }
  }

  // Symulacja uploadu z opóźnieniem
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Symulacja błędu w 20% przypadków
  if (Math.random() < 0.2) {
    return {
      success: false,
      error: 'Wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.'
    }
  }

  return {
    success: true,
    fileName: file.name,
    fileSize: file.size,
    uploadProgress: 100
  }
}

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  // Pobieranie informacji o pliku z FormData podczas przesyłania
  const file = data?.get('file') as File | null
  const fileName = file?.name || ''
  const fileSize = file?.size || 0

  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={pending}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          pending
            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
            : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {pending ? 'Przesyłanie...' : 'Wyślij plik'}
      </button>

      {pending && (
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-800">
              Przesyłanie {fileName} ({Math.round(fileSize / 1024)} KB)...
            </span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Debug informacji z useFormStatus */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">useFormStatus debug:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>pending:</strong> {pending.toString()}</p>
          <p><strong>method:</strong> {method || 'null'}</p>
          <p><strong>action:</strong> {action || 'null'}</p>
          <p><strong>data keys:</strong> {data ? Array.from(data.keys()).join(', ') : 'null'}</p>
          {file && (
            <div>
              <p><strong>Wybrany plik:</strong></p>
              <p>• Nazwa: {file.name}</p>
              <p>• Rozmiar: {Math.round(file.size / 1024)} KB</p>
              <p>• Typ: {file.type}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function FileUploadForm() {
  const [state, action] = useActionState(fileUploadAction, initialState)

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Przesyłanie plików</h2>
      
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Wybierz plik (max 5MB)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Obsługiwane formaty: JPG, PNG, GIF, PDF, TXT
          </p>
        </div>

        <SubmitButton />

        {state.error && (
          <div className="p-3 rounded-md bg-red-100 text-red-800 border border-red-200">
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="p-3 rounded-md bg-green-100 text-green-800 border border-green-200">
            <p className="font-medium">Plik przesłany pomyślnie!</p>
            <p className="text-sm mt-1">
              <strong>Nazwa:</strong> {state.fileName}<br />
              <strong>Rozmiar:</strong> {Math.round((state.fileSize || 0) / 1024)} KB
            </p>
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Stan akcji:</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  )
}