export function getItem(key) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key) {
  window.localStorage.removeItem(key)
}
