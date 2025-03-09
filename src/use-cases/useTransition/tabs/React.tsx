function SlowComponent() {
  for (let i = 0; i < 100000000; i++) {
    //
  }

  return <div>Slow component</div>
}

export function ReactTab() {
  return (
    <div>
      Zakladka reprezentujaca <strong>React</strong>
      {Array.from({ length: 10 }).map((_, i) => (
        <SlowComponent key={i} />
      ))}
    </div>
  )
}
