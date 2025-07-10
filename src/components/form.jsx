import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toUnsignedInt } from '@/lib/number'
import { NotebookPen } from 'lucide-react'
import { useState } from 'react'
import { monotonicFactory } from 'ulid'

export const Form = ({ onSave }) => {
  const [blank, setBlank] = useState(false)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const ulid = monotonicFactory()

  const clearForm = () => {
    document.getElementById('glicemia').value = ''
    document.getElementById('carbo').value = ''
    document.getElementById('insuRapida').value = ''
    document.getElementById('insuBasal').value = ''
  }

  const handleOpen = () => {
    setBlank(false)
    setOpen(true)
    setSaving(false)
    clearForm()
  }

  const handleClose = () => {
    clearForm()
    setBlank(false)
    setSaving(false)
    setOpen(false)
  }

  const handleSubmit = () => {
    setSaving(true)
    setBlank(false)

    const glicemiaEl = document.getElementById('glicemia')
    const carboEl = document.getElementById('carbo')
    const insuRapidaEl = document.getElementById('insuRapida')
    const insuBasalEl = document.getElementById('insuBasal')

    const glicemia = toUnsignedInt(glicemiaEl.value)
    const carbo = toUnsignedInt(carboEl.value)
    const insuRapida = toUnsignedInt(insuRapidaEl.value)
    const insuBasal = toUnsignedInt(insuBasalEl.value)

    if (glicemia === 0 && carbo === 0 && insuRapida === 0 && insuBasal === 0) {
      setSaving(false)
      setBlank(true)
      return false
    }

    setTimeout(() => {
      const dataHora = new Date().toISOString()

      if (insuRapida > 0 && insuBasal > 0) {
        const newNoteRapida = {
          id: ulid(),
          glicemia,
          carbo,
          insuRapida,
          insuBasal: 0,
          dataHora
        }

        const newNoteBasal = {
          id: ulid(),
          glicemia,
          carbo,
          insuRapida: 0,
          insuBasal,
          dataHora
        }

        onSave([newNoteRapida, newNoteBasal])
      } else {
        const newNote = {
          id: ulid(),
          glicemia,
          carbo,
          insuRapida,
          insuBasal,
          dataHora
        }

        onSave([newNote])
      }
      handleClose()
    }, 500)
  }

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild>
        <div className="p-2 pb-4 fixed bottom-1 right-1">
          <Button
            variant="default"
            className="text-2xl size-14 w-44 justify-center"
            onClick={handleOpen}
          >
            <NotebookPen className="size-6" />
            Registrar
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="h-[550px]">
          <div className="w-full flex items-top pt-4 mb-10 justify-center">
            <Card className="w-full max-w-sm justify-start mx-auto">
              <CardContent>
                <DrawerTitle className="text-center mb-4">Novo registro</DrawerTitle>
                {blank ? (
                  <h3 className="text-center text-red-400 mb-4">
                    Informe algum valor nos campos abaixo.
                  </h3>
                ) : null}
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="glicemia">Glicemia (mg/dL)</Label>
                    <Input
                      tabIndex={1}
                      maxLength={3}
                      disabled={saving}
                      id="glicemia"
                      type="tel"
                      className="text-2xl font-bold size-12 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbo">Carboidrato (g)</Label>
                    <Input
                      tabIndex={2}
                      maxLength={3}
                      disabled={saving}
                      id="carbo"
                      type="tel"
                      className="text-2xl font-bold size-12 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuRapida">Insulina rápida (ui)</Label>
                    <Input
                      tabIndex={3}
                      maxLength={3}
                      disabled={saving}
                      id="insuRapida"
                      type="tel"
                      className="text-2xl font-bold size-12 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuBasal">Insulina basal (ui)</Label>
                    <Input
                      tabIndex={4}
                      maxLength={3}
                      disabled={saving}
                      id="insuBasal"
                      type="tel"
                      className="text-2xl font-bold size-12 w-full"
                    />
                  </div>
                </div>
                <CardFooter className="mt-6">
                  <DrawerClose asChild>
                    <Button
                      tabIndex={6}
                      variant="ghost"
                      disabled={saving}
                      className="text-2xl size-12 w-1/2"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      tabIndex={5}
                      id="save"
                      variant="default"
                      className="text-2xl size-12 ml-5 w-1/2"
                      loadingText="Salvando"
                      loading={saving}
                      onClick={handleSubmit}
                    >
                      Salvar
                    </Button>
                  </DrawerClose>
                </CardFooter>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
