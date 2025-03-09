import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/05-refs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/05-refs"!</div>
}
