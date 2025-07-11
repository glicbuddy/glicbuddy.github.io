import { useStorage } from '@/hooks'

export const useNotes = () => useStorage('diabete.notes', [])
