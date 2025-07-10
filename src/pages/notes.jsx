import { Form } from '@/components/form'
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
  const [notes, setNotes] = useStorage('notes', [])

  const isEmpty = !Boolean(notes?.length)

  const groupedNotes = useMemo(
    () => Object.groupBy(notes, ({ dataHora }) => new Date(dataHora).toLocaleDateString()),
    [JSON.stringify(notes)]
  )

  const handleDelete = (id) => {
    if (confirm('Deseja excluir esse registro?')) {
      const allNotes = notes
        .filter((item) => item.id !== id)
        .sort((a, b) => a.dataHora - b.dataHora)

      setNotes(allNotes)
    }
  }

  const handleUpdate = (newNotes = []) => {
    const allNotes = newNotes.concat(notes).sort((a, b) => a.dataHora - b.dataHora)

    setNotes(allNotes)
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
              {Object.keys(groupedNotes)?.map((noteDate, index) => (
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
                          const insuTipo = item.insuRapida ? 'rápida' : 'basal'
                          const insuTipoColor = item.insuRapida ? 'text-red-300' : 'text-blue-300'
                          return (
                            <TableRow
                              key={item.id}
                              className={insuTipoColor}
                              onClick={() => handleDelete(item.id)}
                            >
                              <TableCell className="pl-4 py-4">
                                {item.glicemia ? `${item.glicemia}mg/dL` : '--'}
                              </TableCell>
                              <TableCell className="py-4">
                                {item.carbo ? `${item.carbo} g` : '--'}
                              </TableCell>
                              <TableCell className="py-4">
                                {item.insuRapida || item.insuBasal}ui {insuTipo}
                              </TableCell>
                              <TableCell className="text-right pr-5 py-4">
                                {new Date(item.dataHora).toLocaleTimeString()}
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
      <Form onSave={handleUpdate} />
    </div>
  )
}
