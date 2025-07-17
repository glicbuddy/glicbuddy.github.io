export function toUnsignedInt(value = '') {
  if (typeof value === 'number') {
    return Math.abs(Math.round(value))
  }
  if (typeof value === 'string') {
    return Math.abs(Math.round(Number(value?.replace(/[\d]+gu/, ''))))
  }
  return 0
}
