import { useTransition } from 'react'
import { fetchDataWithError } from '../../utils/'
import { ErrorBoundary } from 'react-error-boundary'

export function UseCase2() {
  return (
    <ErrorBoundary
      fallback={
        <p>
          <strong>🚨 ErrorBoundary </strong>: Coś poszło nie tak...
        </p>
      }
    >
      <UseCase2Logic />
    </ErrorBoundary>
  )
}

function UseCase2Logic() {
  const [isPending, startTransition] = useTransition()

  async function handleOnClick() {
    startTransition(async () => {
      await fetchDataWithError()
    })
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        onClick={handleOnClick}
        className='bg-blue-500 px-4 py-2 rounded-xl text-white cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-gray-300 transition-colors'
        disabled={isPending}
      >
        Pobierz dane
      </button>

      <span>
        <span>
          <span>isPending:</span>

          {isPending ? (
            <strong className='text-green-500'>true</strong>
          ) : (
            <strong className='text-red-500'>false</strong>
          )}
        </span>
      </span>
    </div>
  )
}
