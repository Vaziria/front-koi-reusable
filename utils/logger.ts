const isProduction = process.env.NODE_ENV === 'production'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Log (message: any): void {
  if (!isProduction) {
    console.log(message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorLog (error: any): void {
  if (!isProduction) {
    console.error(error)
  }
}
