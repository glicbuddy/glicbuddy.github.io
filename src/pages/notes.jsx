import { Actions } from '@/components/actions'
import { Header } from '@/components/header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useStorage } from '@/hooks'
import { useMemo } from 'react'

export const NotesPage = () => {
  const [notes, setNotes] = useStorage('diabete.notes', [])

  const isEmpty = !Boolean(notes?.length)

  const groupedNotes = useMemo(
    () => Object.groupBy(notes, ({ date }) => new Date(date).toLocaleDateString()),
    [JSON.stringify(notes)]
  )

  const prepareNote = (item) => {
    const insuType = item.insuFast ? 'rápida' : 'basal'
    const insuColor = item.insuFast ? 'text-red-300' : 'text-blue-300'
    const insuFastOrBasal = item.insuFast || item.insuBasal
    const glicValue = item.glic ? `${item.glic} mg/dL` : '--'
    const carboValue = item.carbo ? `${item.carbo} g` : '--'
    const timeValue = new Date(item.date).toLocaleTimeString()
    const dateValue = new Date(item.date).toLocaleDateString()
    const insuValue = insuFastOrBasal ? `${insuFastOrBasal}ui ${insuType}` : '--'
    return {
      id: item.id,
      insuColor,
      insuType,
      insuValue,
      timeValue,
      dateValue,
      carboValue,
      glicValue
    }
  }

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esse registro?')) {
      setNotes(notes.filter((item) => item.id !== id))
    }
  }

  const handleUpdate = (newNotes = []) => {
    setNotes(newNotes.concat(notes).sort((a, b) => a.date - b.date))
  }

  return (
    <div className="w-full flex items-center pb-20 justify-center min-h-screen">
      <Card className="w-full max-w-sm justify-center mx-auto">
        <Header />
        <CardContent className="p-0">
          {isEmpty ? (
            <h2 className="text-center my-10">Nenhum registro de glicemia</h2>
          ) : (
            <Accordion type="single" collapsible>
              {Object.keys(groupedNotes)?.map((noteDate) => (
                <AccordionItem value={noteDate} key={noteDate}>
                  <AccordionTrigger className="px-4">Data: {noteDate}</AccordionTrigger>
                  <AccordionContent className="px-0">
                    <Table className="overflow-x-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-4">Glicemia</TableHead>
                          <TableHead>Carbo</TableHead>
                          <TableHead>Insulina</TableHead>
                          <TableHead className="text-right pr-5">Horário</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedNotes?.[noteDate]?.map((item) => {
                          const note = prepareNote(item)
                          return (
                            <TableRow
                              key={note.id}
                              className={note.insuColor}
                              onClick={() => handleDelete(note.id)}
                            >
                              <TableCell className="pl-4 py-4">{note.glicValue}</TableCell>
                              <TableCell className="py-4">{note.carboValue}</TableCell>
                              <TableCell className="py-4">{note.insuValue}</TableCell>
                              <TableCell className="text-right pr-5 py-4">
                                {note.timeValue}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      <Actions onSave={handleUpdate} />
    </div>
  )
}
