import { createFileRoute } from '@tanstack/react-router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UseCase1, UseCase2 } from '../use-cases/useTransition/'

export const Route = createFileRoute('/03-use-transition')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      {/* <UseCase1 />  */}
      <UseCase2 />
    </>
  )
}
