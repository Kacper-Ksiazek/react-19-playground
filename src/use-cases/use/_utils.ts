interface APIData {
  bestJavascriptFramework: string
}

export async function fetchData(): Promise<APIData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ bestJavascriptFramework: 'Svelte' })
    }, 200)
  })
}

//
//
//
//
//
//

let counter = 0

export async function fetchDataWithLogger(): Promise<APIData> {
  return new Promise((resolve) => {
    console.log('Pobieram dane po raz: ', ++counter)

    setTimeout(() => {
      console.log('Dane pobrane!')

      resolve({ bestJavascriptFramework: 'Svelte' })
    }, 200)
  })
}

//
//
//
//
//
//

const customCacheMemory = new Map<PropertyKey, Promise<unknown>>()

function cosNaWzorUseQuery<T>(
  queryKey: PropertyKey,
  queryFn: () => Promise<T>,
): Promise<T> {
  if (!customCacheMemory.has(queryKey)) {
    customCacheMemory.set(queryKey, queryFn())
  }

  return customCacheMemory.get(queryKey) as Promise<T>
}

export function fetchDataZCustomowymCachem(): Promise<APIData> {
  return cosNaWzorUseQuery('fetchDataZCustomowymCachem', fetchDataWithLogger)
}
