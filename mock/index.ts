let mock = false

export function useMock (): void {
  if (process.env.NODE_ENV !== 'production') {
    mock = true
  }
}

export function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isMock (): boolean {
  return mock
}
