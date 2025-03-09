import { APIData } from '../types/api'
import { fetchDataWithLogger } from './fetchDataWithLogger'

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
