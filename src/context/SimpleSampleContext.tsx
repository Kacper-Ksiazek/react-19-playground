import { createContext } from 'react'

export const SimpleSampleContext = createContext<{
  bestJavascriptFramework: string
}>({
  bestJavascriptFramework: 'Svelte',
})

// Lowercased on purpose
export const simpleSampleContext = createContext<{
  bestJavascriptFramework: string
}>({
  bestJavascriptFramework: 'Svelte',
})
