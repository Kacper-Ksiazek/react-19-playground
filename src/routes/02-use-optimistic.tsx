import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/02-use-optimistic')({
  component: About,
})

function About() {
  return <div>Hello from useOptimistic!</div>
}
