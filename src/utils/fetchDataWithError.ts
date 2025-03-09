import { APIData } from '../types/api'

export async function fetchDataWithError(): Promise<APIData> {
  return new Promise(() => {
    setTimeout(() => {
      throw new Error('Ups! Coś poszło nie tak...')
    }, 1000)
  })
}
