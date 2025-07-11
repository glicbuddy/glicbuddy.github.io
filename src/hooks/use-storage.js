import { getItem, setItem } from '@/lib/storage'
import { useEffect, useState } from 'react'

export const useStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getItem(key) || defaultValue
  })

  useEffect(() => setItem(key, value), [key, JSON.stringify(value)])

  return [value, setValue]
}
