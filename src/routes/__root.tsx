import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const NavButton = ({ to, children }: { to: string; children: string }) => (
  <Link
    to={to}
    className='px-4 py-2 [&.active]:bg-blue-400 radius-2 bg-slate-100 hover:bg-slate-200 transition-colors'
  >
    {children}
  </Link>
)

export const Route = createRootRoute({
  component: () => (
    <div className='flex flex-col gap-4 bg-slate-100 min-h-[100dvh] p-4'>
      <nav className='p-2 flex gap-2 align-center bg-white rounded-xl'>
        <NavButton to='/'>Home</NavButton>
        <NavButton to='/about'>About</NavButton>
      </nav>

      <main className='grow bg-white rounded-xl'>
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  ),
})
