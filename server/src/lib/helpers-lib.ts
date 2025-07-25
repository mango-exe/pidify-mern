
const getFormattedTimestamp = (): string => {
  const now: Date = new Date()

  const seconds: string = String(now.getSeconds()).padStart(2, '0')
  const hours: string = String(now.getHours()).padStart(2, '0')
  const minutes: string = String(now.getMinutes()).padStart(2, '0')
  const day: string = String(now.getDate()).padStart(2, '0')
  const month: string = String(now.getMonth() + 1).padStart(2, '0')
  const year: number = now.getFullYear()

  return `${hours}-${minutes}-${seconds}-${day}-${month}-${year}`
}

export {
  getFormattedTimestamp
}
