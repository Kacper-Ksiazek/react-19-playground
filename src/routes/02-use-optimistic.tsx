import { createFileRoute } from '@tanstack/react-router'
import { UseCase1 } from '../use-cases/useOptimistic/use_one'

export const Route = createFileRoute('/02-use-optimistic')({
  component: About,
})

function About() {
  return (
    <>
      <UseCase1 />
    </>
  )
}
