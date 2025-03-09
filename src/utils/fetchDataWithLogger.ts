import { APIData } from '../types/api'

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
