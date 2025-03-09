import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/01-use')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/01-use"!</div>
}
