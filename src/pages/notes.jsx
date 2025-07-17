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
import { useNotes } from '@/hooks'
import { CalendarHeart } from 'lucide-react'

export const Notes = () => {
  const [notes, { prepareNote, listNoteDates, listNotesByDate, removeNote }] = useNotes()

  const isEmpty = !Boolean(notes?.length)
  const noteDates = listNoteDates()

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esse registro?')) {
      removeNote(id)
    }
  }

  return (
    <div className="w-full flex items-center pb-40 justify-center min-h-screen">
      <Card className="w-full max-w-sm justify-center mx-auto">
        <Header />
        <CardContent className="p-0">
          {isEmpty ? (
            <h2 className="text-center my-10">Nenhum registro de glicemia</h2>
          ) : (
            <Accordion type="single" collapsible>
              {noteDates.map((noteDate) => (
                <AccordionItem value={noteDate} key={noteDate}>
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <CalendarHeart className="mr-2 size-5" />
                      {noteDate}
                    </div>
                  </AccordionTrigger>
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
                        {listNotesByDate(noteDate).map((item) => {
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
                              <TableCell
                                className="text-right pr-5 py-4"
                                title={`${note.dateValue} ${note.timeValue}`}
                              >
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
      <Actions />
    </div>
  )
}
