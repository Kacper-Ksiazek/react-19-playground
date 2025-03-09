import { createFileRoute } from '@tanstack/react-router'
import { SimpleSampleContext } from '../context/SimpleSampleContext'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UseCase1, UseCase2 } from '../use-cases/use'

export const Route = createFileRoute('/01-use')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SimpleSampleContext value={{ bestJavascriptFramework: 'Svelte' }}>
      {/* <UseCase1 /> */}
      {/* <UseCase1 isStillLoading /> */}
      <UseCase2 />
    </SimpleSampleContext>
  )
}
