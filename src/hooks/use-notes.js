import { useStorage } from '@/hooks'
import { toMidnightDateTimestamp } from '@/lib/date'
import { toUnsignedInt } from '@/lib/number'
import { useMemo } from 'react'
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

const LIMIT_NOTES = 1000

export const useNotes = () => {
  const [notes, setNotes] = useStorage('diabete.notes', [])

  const sortedNotes = useMemo(() => notes.sort((a, b) => a.date - b.date), [notes])

  const sortedNoteDates = useMemo(() => {
    const noteDates = sortedNotes
      .map(({ date }) => toMidnightDateTimestamp(date))
      .sort()
      .reverse()

    return Array.from(new Set(noteDates), (date) => new Date(date).toLocaleDateString())
  }, [sortedNotes])

  const groupedNotes = useMemo(
    () => Object.groupBy(sortedNotes, ({ date }) => new Date(date).toLocaleDateString()),
    [notes]
  )

  const isValidNote = ({ glic, carbo, insuFast, insuBasal, date }) => {
    try {
      return (
        (toUnsignedInt(glic) > 0 ||
          toUnsignedInt(carbo) > 0 ||
          toUnsignedInt(insuFast) > 0 ||
          toUnsignedInt(insuBasal) > 0) &&
        new Date(date).toISOString()
      )
    } catch {
      return false
    }
  }

  const operations = {
    setNotes,
    isValidNote,
    listNoteDates: () => sortedNoteDates ?? [],
    listNotesByDate: (noteDate) => {
      const allNotes = groupedNotes?.[noteDate] ?? []
      return allNotes.sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    restoreNotes: (content = []) => {
      if (Array.isArray(content)) {
        const allNotes = content
          .map(({ id, date, glic, carbo, insuFast, insuBasal }) => ({
            id: id || ulid(),
            date,
            glic,
            carbo,
            insuFast,
            insuBasal
          }))
          .filter(isValidNote)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .reverse()
          .slice(0, LIMIT_NOTES)

        setNotes(allNotes)
        return true
      }
      return false
    },
    saveNotes: (newNotes = []) => {
      const allNotes = newNotes
        .map((note) => ({
          id: ulid(),
          date: new Date(note.date).toISOString(),
          glic: toUnsignedInt(note.glic),
          carbo: toUnsignedInt(note.carbo),
          insuFast: toUnsignedInt(note.insuFast),
          insuBasal: toUnsignedInt(note.insuBasal)
        }))
        .concat(notes)
        .sort((a, b) => a.date - b.date)
        .slice(0, LIMIT_NOTES)

      setNotes(allNotes)
    },
    removeNote: (noteId) => setNotes(notes.filter((note) => note.id !== noteId)),
    prepareNote: (note) => {
      const isGlicNormal = note.glic == 0 || (note.glic > 70 && note.glic < 180)
      const color = isGlicNormal ? 'text-gray-400' : 'text-red-300'
      const insuFastOrBasal = note.insuFast || note.insuBasal
      const insuType = note.insuFast ? 'rápida' : 'basal'
      const glicValue = note.glic ? `${note.glic} mg/dL` : '--'
      const carboValue = note.carbo ? `${note.carbo} g` : '--'
      const timeValue = new Date(note.date).toLocaleTimeString().slice(0, 5)
      const dateValue = new Date(note.date).toLocaleDateString()
      const insuValue = insuFastOrBasal ? `${insuFastOrBasal}ui ${insuType}` : '--'
      return {
        id: note.id,
        color,
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
