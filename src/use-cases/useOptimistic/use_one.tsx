import { useOptimistic, useTransition } from 'react'
import { fetchDataWithError } from '../../utils/'

export function UseCase1() {
  const [isPending, startTransition] = useTransition()
  const [optimisticName, setOptimisticName] = useOptimistic<string>('Svelte')

  async function updateNameAction(formData: FormData) {
    const updatedName = formData.get('name') as string

    startTransition(() => {
      setOptimisticName(updatedName)
    })

    await fetchDataWithError(2000)
  }

  return (
    <form
      action={updateNameAction}
      className='flex flex-col items-center gap-2'
    >
      <input
        type='text'
        name='name'
        defaultValue={optimisticName}
        className='bg-slate-300'
      />

      <button
        type='submit'
        disabled={isPending}
        className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
      >
        Zaktualizuj
      </button>
    </form>
  )
}
