import { useStorage } from '@/hooks'
import { toMidnightDateTimestamp } from '@/lib/date'
import { toUnsigned } from '@/lib/number'
import { getPreGlicPeriodLabel, isValidPreGlicPeriod } from '@/lib/utils'
import { useMemo } from 'react'
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

const LIMIT_NOTES = 2000

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

  const sortedGlicNoteDates = useMemo(() => {
    const noteDates = sortedNotes
      .filter(
        ({ glic, preGlicPeriod }) => isValidPreGlicPeriod(preGlicPeriod) && toUnsigned(glic) > 0
      )
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
        (toUnsigned(glic) > 0 ||
          toUnsigned(carbo) > 0 ||
          toUnsigned(insuFast) > 0 ||
          toUnsigned(insuBasal) > 0) &&
        new Date(date).toISOString()
      )
    } catch {
      return false
    }
  }

  const isGlicNormal = (glic = 0) => glic == 0 || (glic > 70 && glic < 180)

  const operations = {
    setNotes,
    isValidNote,
    listGlicNoteDates: () => sortedGlicNoteDates ?? [],
    listNoteDates: () => sortedNoteDates ?? [],
    listNotesByDate: (noteDate) => {
      const allNotes = groupedNotes?.[noteDate] ?? []
      return allNotes.sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    listValidPreGlicNotes: () =>
      sortedNotes.filter(
        ({ glic, preGlicPeriod }) => isValidPreGlicPeriod(preGlicPeriod) && toUnsigned(glic) > 0
      ),
    preparePreGlicNoteByDate: (noteDate) => {
      const allNotes = groupedNotes?.[noteDate] ?? []
      return allNotes
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .reduce(
          (acc, note) => {
            const color = isGlicNormal(note.glic) ? 'text-gray-400' : 'text-red-300'
            const colorHex = isGlicNormal(note.glic) ? '#000000' : '#EF4444'
            const glic = note.glic > 0 ? `${note.glic} mg/dL` : ''
            const preGlicPeriodData = {
              [`${note.preGlicPeriod}Glic`]: glic,
              [`${note.preGlicPeriod}Color`]: color,
              [`${note.preGlicPeriod}ColorHex`]: colorHex
            }
            return { ...acc, ...preGlicPeriodData }
          },
          { date: noteDate }
        )
    },

    restoreNotes: (content = []) => {
      if (Array.isArray(content)) {
        const allNotes = content
          .map(({ id, date, glic, carbo, insuFast, insuBasal, preGlicPeriod }) => ({
            id: id || ulid(),
            date,
            glic,
            carbo,
            insuFast,
            insuBasal,
            preGlicPeriod
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
          glic: toUnsigned(note.glic),
          carbo: toUnsigned(note.carbo),
          insuFast: toUnsigned(note.insuFast),
          insuBasal: toUnsigned(note.insuBasal),
          preGlicPeriod: note.preGlicPeriod
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
      const insuFixedValue = Number.isSafeInteger(insuFastOrBasal) ? 0 : 1
      const insuValue = insuFastOrBasal
        ? `${insuFastOrBasal.toFixed(insuFixedValue)}ui ${insuType}`
        : '--'
      const preGlicPeriodLabel = getPreGlicPeriodLabel(note?.preGlicPeriod)
      return {
        id: note.id,
        color,
        insuType,
        insuValue,
        timeValue,
        dateValue,
        carboValue,
        glicValue,
        preGlicPeriodLabel
      }
    }
  }

  return [notes, operations]
}
