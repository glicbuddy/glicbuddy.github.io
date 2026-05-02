export function toUnsigned(value = '') {
  if (typeof value === 'number') {
    return Math.abs(value)
  }
  if (typeof value === 'string') {
    return Math.abs(Number(value?.replace(/[\d]+gu/, '')))
  }
  return 0
}
