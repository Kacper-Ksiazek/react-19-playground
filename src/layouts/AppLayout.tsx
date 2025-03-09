// src/layouts/AppLayout.tsx
import React from 'react'
import { Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const AppLayout: React.FC = () => {
  return (
    <div>
      <header>
        <nav>
          {/* Navigation links */}
          <Link to='/'>Home</Link> | <Link to='/about'>About</Link>
        </nav>
      </header>
      <main>
        {/* This outlet renders child routes */}
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </div>
  )
}

export default AppLayout
