import { APIData } from '../types/api'

export async function fetchData(timeout: number = 200): Promise<APIData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ bestJavascriptFramework: 'Svelte' })
    }, timeout)
  })
}
