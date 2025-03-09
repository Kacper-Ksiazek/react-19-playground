import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const NavButton = ({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) => (
  <Link
    to={to}
    className='px-4 py-2 [&.active]:bg-blue-400 radius-2 bg-slate-100 hover:bg-slate-200 transition-colors'
  >
    {children}
  </Link>
)

const Code = ({ children }: { children: string }) => (
  <span className='italic font-mono bg-orange-200 px-1 rounded-sm'>
    {children}
  </span>
)

export const Route = createRootRoute({
  component: () => (
    <div className='flex flex-col gap-4 bg-slate-100 min-h-[100dvh] p-4'>
      <nav className='p-2 flex gap-2 align-center bg-white rounded-xl'>
        <NavButton to='/01-use'>
          1.Funkcja: <Code>use</Code>
        </NavButton>

        <NavButton to='/02-use-optimistic'>
          2. Hook: <Code>useOptimistic</Code>
        </NavButton>

        <NavButton to='/03-use-transition'>
          3. Hook: <Code>useTransition</Code>
        </NavButton>

        <NavButton to='/04-use-action-state'>
          4. Hook: <Code>useActionState</Code>
        </NavButton>

        <NavButton to='/05-refs'>5. Nowe refy</NavButton>
      </nav>

      <main className='grow bg-white rounded-xl p-4'>
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  ),
})
