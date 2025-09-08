# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build project (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Single Test Execution
This project doesn't include test configuration. Tests would need to be set up with a testing framework.

## Architecture

### Tech Stack
- **React 19.0.0** - Latest React with new features like `use`, `useOptimistic`, `useTransition`, `useFormStatus`, `useActionState`
- **TanStack Router** - File-based routing with type safety
- **TypeScript** - Full TypeScript support
- **Vite** - Build tool with HMR
- **Tailwind CSS 4.0** - Styling with latest version
- **React Error Boundary** - Error handling

### Project Structure
This is a React 19 playground demonstrating new features through numbered route examples:

- `src/routes/` - File-based routes demonstrating React 19 features:
  - `01-use.tsx` - `use` function examples
  - `02-use-optimistic.tsx` - `useOptimistic` hook examples  
  - `03-use-transition.tsx` - `useTransition` hook examples
  - `04-use-form-status.tsx` - `useFormStatus` hook examples
  - `05-use-action-state.tsx` - `useActionState` hook examples
  - `06-refs.tsx` - New ref features

- `src/use-cases/` - Organized by React feature with multiple use case examples:
  - `use/` - Different `use` function implementations
  - `useOptimistic/` - `useOptimistic` examples
  - `useTransition/` - `useTransition` examples with tabs (React, Svelte, Vue)

- `src/utils/` - Data fetching utilities:
  - `fetchData.ts` - Basic data fetching
  - `fetchDataWithLogger.ts` - Data fetching with logging
  - `fetchDataWithError.ts` - Data fetching with error handling
  - `fetchDataZCustomowymCachem.ts` - Data fetching with custom caching

### Key Architectural Patterns

1. **File-based Routing**: Uses TanStack Router with automatic route generation via `routeTree.gen.ts`

2. **Context Integration**: Simple context setup in `context/SimpleSampleContext.tsx` for sharing data

3. **Component Organization**: Route components import and showcase specific use cases, with navigation handled in `__root.tsx`

4. **Type Safety**: Centralized API types in `src/types/api.ts` with `APIData` interface

### Development Notes

- Route components are typically thin wrappers that import and display use case components
- Use cases are organized by React feature and numbered for easy navigation
- The root layout provides navigation between different React 19 features
- TanStack Router DevTools are included for development
- Auto code splitting is enabled in the router configuration