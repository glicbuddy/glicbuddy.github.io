export function toUnsignedInt(value = '') {
  return Math.abs(Math.round(Number(value?.replace(/[\d]+gu/, ''))))
}
