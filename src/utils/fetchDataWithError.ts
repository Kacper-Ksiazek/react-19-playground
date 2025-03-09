import { APIData } from '../types/api'

export async function fetchDataWithError(
  timeout: number = 1000,
): Promise<APIData> {
  return new Promise(() => {
    setTimeout(() => {
      throw new Error('Ups! Coś poszło nie tak...')
    }, timeout)
  })
}
