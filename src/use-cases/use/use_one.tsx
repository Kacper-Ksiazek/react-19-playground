import { SimpleSampleContext } from '../../context/SimpleSampleContext'
import { use } from 'react'

export function UseCase1({ isStillLoading }: { isStillLoading?: boolean }) {
  if (isStillLoading) return <div>Wczytuje...</div>

  const contextValue = use(SimpleSampleContext)
  // const contextValue= useContext(SimpleSampleContext)

  // function onDelete() {
  //   const { bestJavascriptFramework } = use(SimpleSampleContext)

  //   console.log(bestJavascriptFramework)
  // }

  return (
    <div>
      Wartosc wyciagnieta z contextu:{' '}
      <code>{JSON.stringify(contextValue)}</code>
    </div>
  )
}
