import { useStorage } from '@/hooks'
import { useMemo } from 'react'

export const useNotes = () => {
  const [notes, setNotes] = useStorage('diabete.notes', [])

  const groupedNotes = useMemo(
    () => Object.groupBy(notes, ({ date }) => new Date(date).toLocaleDateString()),
    [notes]
  )

  const operations = {
    listNoteDates: () => Object.keys(groupedNotes) ?? [],
    listNotesByDate: (noteDate) => groupedNotes?.[noteDate] ?? [],
    saveNotes: (newNotes = []) => setNotes(newNotes.sort((a, b) => a.date - b.date)),
    removeNote: (noteId) => setNotes(notes.filter((note) => note.id !== noteId)),
    prepareNote: (note) => {
      const insuType = note.insuFast ? 'rápida' : 'basal'
      const insuColor = note.insuFast ? 'text-red-300' : 'text-blue-300'
      const insuFastOrBasal = note.insuFast || note.insuBasal
      const glicValue = note.glic ? `${note.glic} mg/dL` : '--'
      const carboValue = note.carbo ? `${note.carbo} g` : '--'
      const timeValue = new Date(note.date).toLocaleTimeString()
      const dateValue = new Date(note.date).toLocaleDateString()
      const insuValue = insuFastOrBasal ? `${insuFastOrBasal}ui ${insuType}` : '--'
      return {
        id: note.id,
        insuColor,
        insuType,
        insuValue,
        timeValue,
        dateValue,
        carboValue,
        glicValue
      }
    }
  }

  return [notes, operations]
}
