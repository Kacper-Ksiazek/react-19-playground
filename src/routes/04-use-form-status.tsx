import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/04-use-form-status')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/04-use-form-status"!</div>
}
