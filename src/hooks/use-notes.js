import { useStorage } from '@/hooks'
import { useMemo } from 'react'
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

const LIMIT_NOTES = 1000

export const useNotes = () => {
  const [notes, setNotes] = useStorage('diabete.notes', [])

  const groupedNotes = useMemo(
    () =>
      Object.groupBy(
        notes.sort((a, b) => a.date - b.date),
        ({ date }) => new Date(date).toLocaleDateString()
      ),
    [notes]
  )

  const operations = {
    listNoteDates: () => Object.keys(groupedNotes) ?? [],
    listNotesByDate: (noteDate) => groupedNotes?.[noteDate] ?? [],
    saveNotes: (newNotes = []) => {
      const allNotes = newNotes
        .map((note) => ({ id: ulid(), date: new Date().toISOString(), ...note }))
        .concat(notes)
        .sort((a, b) => a.date - b.date)
        .slice(0, LIMIT_NOTES)

      setNotes(allNotes)
    },
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
