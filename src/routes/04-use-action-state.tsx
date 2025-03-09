import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/04-use-action-state')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/04-use-action-state"!</div>
}
