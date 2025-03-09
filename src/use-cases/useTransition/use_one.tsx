import { useTransition, useState } from 'react'
import { ReactTab } from './tabs/React'
import { SvelteTab } from './tabs/Svelte'
import { VueTab } from './tabs/Vue'

export type TabType = 'REACT' | 'SVELTE' | 'VUE'

export function UseCase1() {
  const [isPending, startTransition] = useTransition()

  const [tab, setTab] = useState<TabType>('SVELTE')

  function handleClick(tab: TabType) {
    startTransition(() => setTab(tab))
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex gap-2'>
        <button
          onClick={handleClick.bind(null, 'REACT')}
          className='bg-blue-500 px-4 py-2 rounded-xl text-white cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-gray-300 transition-colors'
          disabled={isPending}
        >
          React
        </button>
        <button
          onClick={handleClick.bind(null, 'SVELTE')}
          className='bg-blue-500 px-4 py-2 rounded-xl text-white cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-gray-300 transition-colors'
        >
          Svelte
        </button>
        <button
          onClick={handleClick.bind(null, 'VUE')}
          className='bg-blue-500 px-4 py-2 rounded-xl text-white cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-gray-300 transition-colors'
        >
          Vue
        </button>
      </div>

      <div className='mt-4'>
        {tab === 'REACT' && <ReactTab />}
        {tab === 'SVELTE' && <SvelteTab />}
        {tab === 'VUE' && <VueTab />}
      </div>
    </div>
  )
}
