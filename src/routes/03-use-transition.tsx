import { createFileRoute } from '@tanstack/react-router'

import { UseCase1 } from '../use-cases/useTransition/'

export const Route = createFileRoute('/03-use-transition')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <UseCase1 />
    </>
  )
}
