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
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useNotes } from '@/hooks'
import { PRE_INSU_PERIODS } from '@/lib/utils'
import { CalendarHeart } from 'lucide-react'
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
  const [, { listNoteDates, listValidPreInsuNotes, preparePreInsuNoteByDate }] = useNotes()
  const preInsuNotes = listValidPreInsuNotes()
  const isEmpty = !Boolean(preInsuNotes?.length)
  const noteDates = listNoteDates()

  return isEmpty ? (
    <h2 className="text-center my-10">Nenhum registro de glicemia</h2>
  ) : (
    <Table className="overflow-x-hidden">
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">Data</TableHead>
          {Object.values(PRE_INSU_PERIODS).map((period) => (
            <TableHead key={period}>{period}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {noteDates.map((noteDate) => {
          const note = preparePreInsuNoteByDate(noteDate)
          return (
            <TableRow key={note.date}>
              <TableCell className="pl-4">
                {note.date}
              </TableCell>
              <TableCell className={note.preCafeManhaColor}>
                {note.preCafeManhaGlic ? `${note.preCafeManhaGlic} mg/dL` : '--'}
              </TableCell>
              <TableCell className={note.preAlmocoColor}>
                {note.preAlmocoGlic ? `${note.preAlmocoGlic} mg/dL` : '--'}
              </TableCell>
              <TableCell className={note.preCafeTardeColor}>
                {note.preCafeTardeGlic ? `${note.preCafeTardeGlic} mg/dL` : '--'}
              </TableCell>
              <TableCell className={note.preJantarColor}>
                {note.preJantarGlic ? `${note.preJantarGlic} mg/dL` : '--'}
              </TableCell>
              <TableCell className={note.preDormirColor}>
                {note.preDormirGlic ? `${note.preDormirGlic} mg/dL` : '--'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
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
