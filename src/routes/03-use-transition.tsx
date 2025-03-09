import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/03-use-transition')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/03-use-transition"!</div>
}
