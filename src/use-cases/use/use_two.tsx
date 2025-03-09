import { use } from 'react'

import { fetchData } from './_utils'

import { Suspense } from 'react'
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
      <Suspense
        fallback={
          <p>
            <strong>⌛ Suspense </strong>: Ładowanie...
          </p>
        }
      >
        {/*  */}
        {/*  */}
        {/*  */}
        <UseCase2Logic />
        {/*  */}
        {/*  */}
        {/*  */}
      </Suspense>
    </ErrorBoundary>
  )
}

function UseCase2Logic() {
  const apiData = use(fetchData())

  return (
    <div>
      Pobrane za pomoca fetcha dane:
      <code>{JSON.stringify(apiData)}</code>
    </div>
  )
}
