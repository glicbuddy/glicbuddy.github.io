import { Actions } from '@/components/actions'
import { Header } from '@/components/header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import { PRE_GLIC_PERIODS, downloadGlicNotesPDF } from '@/lib/utils'
import { CalendarHeart, FileText } from 'lucide-react'
import { useState } from 'react'

const ListInsuNotes = () => {
  const [notes, { prepareNote, listNoteDates, listNotesByDate, removeNote }] = useNotes()
  const noteDates = listNoteDates()
  const isEmpty = !Boolean(notes?.length)

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esse registro?')) {
      removeNote(id)
    }
  }
  return isEmpty ? (
    <h2 className="text-center my-10">Nenhum registro de insulina</h2>
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
                      className={note.color}
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
  )
}

const ListGlicNotes = () => {
  const [, { listGlicNoteDates, preparePreGlicNoteByDate }] = useNotes()
  const noteDates = listGlicNoteDates()
  const isEmpty = !Boolean(noteDates?.length)

  if (isEmpty) {
    return <h2 className="text-center my-10">Nenhum registro de glicemia</h2>
  }

  const notesByDates = noteDates.map(preparePreGlicNoteByDate)
  return (
    <div className="w-full text-center">
      <Button
        variant="secondary"
        className="w-1/2 mb-2"
        title="Gerar PDF"
        onClick={() => downloadGlicNotesPDF(notesByDates)}
      >
        <FileText className="size-5" />
        Gerar PDF
      </Button>
      <Table className="overflow-x-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Data</TableHead>
            {Object.values(PRE_GLIC_PERIODS).map((period) => (
              <TableHead key={period}>{period}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {notesByDates.map((note) => (
            <TableRow key={note.date}>
              <TableCell className="pl-4">{note.date}</TableCell>
              <TableCell className={note.preCafeManhaColor}>
                {note.preCafeManhaGlic ?? '--'}
              </TableCell>
              <TableCell className={note.preAlmocoColor}>{note.preAlmocoGlic ?? '--'}</TableCell>
              <TableCell className={note.preCafeTardeColor}>
                {note.preCafeTardeGlic ?? '--'}
              </TableCell>
              <TableCell className={note.preJantarColor}>{note.preJantarGlic ?? '--'}</TableCell>
              <TableCell className={note.preDormirColor}>{note.preDormirGlic ?? '--'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const Notes = () => {
  const [activeTab, setActiveTab] = useState('insulina')

  return (
    <div className="w-full flex items-center pb-40 justify-center min-h-screen">
      <Card className="w-full max-w-sm justify-center mx-auto">
        <Header />
        <CardContent className="p-0">
          <ButtonGroup className="w-full mb-4 justify-center">
            <Button
              variant={activeTab === 'insulina' ? 'default' : 'outline'}
              onClick={() => setActiveTab('insulina')}
            >
              Registros de Insulina
            </Button>
            <Button
              variant={activeTab === 'glicemia' ? 'default' : 'outline'}
              onClick={() => setActiveTab('glicemia')}
            >
              Registros de Glicemia
            </Button>
          </ButtonGroup>
          {activeTab === 'insulina' && <ListInsuNotes />}
          {activeTab === 'glicemia' && <ListGlicNotes />}
        </CardContent>
      </Card>
      <Actions />
    </div>
  )
}
