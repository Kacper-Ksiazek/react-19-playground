import { APIData } from '../types/api'

export async function fetchData(): Promise<APIData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ bestJavascriptFramework: 'Svelte' })
    }, 200)
  })
}
