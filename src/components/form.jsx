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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
    document.getElementById('glic').value = ''
    document.getElementById('carbo').value = ''
    document.getElementById('insuFast').value = ''
    document.getElementById('insuBasal').value = ''
  }

  const clearWarnings = () => setBlank(false)

  const handleOpen = () => {
    setBlank(false)
    setOpen(true)
    setSaving(false)
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

    const glicEl = document.getElementById('glic')
    const carboEl = document.getElementById('carbo')
    const insuFastEl = document.getElementById('insuFast')
    const insuBasalEl = document.getElementById('insuBasal')

    const glic = toUnsignedInt(glicEl.value)
    const carbo = toUnsignedInt(carboEl.value)
    const insuFast = toUnsignedInt(insuFastEl.value)
    const insuBasal = toUnsignedInt(insuBasalEl.value)

    if (glic === 0 && carbo === 0 && insuFast === 0 && insuBasal === 0) {
      setSaving(false)
      setBlank(true)
      return false
    }

    setTimeout(() => {
      const date = new Date().toISOString()

      if (insuFast > 0 && insuBasal > 0) {
        const newNoteFast = {
          id: ulid(),
          glic,
          carbo,
          insuFast,
          insuBasal: 0,
          date
        }

        const newNoteBasal = {
          id: ulid(),
          glic,
          carbo,
          insuFast: 0,
          insuBasal,
          date
        }

        onSave([newNoteFast, newNoteBasal])
      } else {
        const newNote = {
          id: ulid(),
          glic,
          carbo,
          insuFast,
          insuBasal,
          date
        }

        onSave([newNote])
      }
      handleClose()
    }, 500)
  }

  return (
    <Drawer open={open} repositionInputs={false} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex flex-col p-2 fixed bottom-1 right-1">
          <Button variant="default" className="size-12 mb-2" onClick={handleOpen}>
            <NotebookPen className="size-5" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="h-[550px]">
          <div className="w-full flex items-top pt-4 mb-10 justify-center">
            <Card className="w-full max-w-sm justify-start mx-auto">
              <CardContent>
                <DrawerTitle className="text-center mb-4">Novo registro</DrawerTitle>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="glic">Glicemia (mg/dL)</Label>
                    <Input
                      autoFocus
                      tabIndex={1}
                      maxLength={3}
                      disabled={saving}
                      onFocus={clearWarnings}
                      id="glic"
                      type="tel"
                      className="text-xl font-bold size-10 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbo">Carboidrato (g)</Label>
                    <Input
                      tabIndex={2}
                      maxLength={3}
                      disabled={saving}
                      onFocus={clearWarnings}
                      id="carbo"
                      type="tel"
                      className="text-xl font-bold size-10 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuFast">Insulina rápida (ui)</Label>
                    <Input
                      tabIndex={3}
                      maxLength={3}
                      disabled={saving}
                      onFocus={clearWarnings}
                      id="insuFast"
                      type="tel"
                      className="text-xl font-bold size-10 w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuBasal">Insulina basal (ui)</Label>
                    <Input
                      tabIndex={4}
                      maxLength={3}
                      disabled={saving}
                      onFocus={clearWarnings}
                      id="insuBasal"
                      type="tel"
                      className="text-xl font-bold size-10 w-full"
                    />
                  </div>
                </div>
                <CardFooter className="mt-6 px-0">
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      disabled={saving}
                      className="text-xl size-10 w-1/2"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Tooltip open={blank} disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button
                          id="save"
                          tabIndex={5}
                          className="text-xl size-10 w-1/2"
                          loading={saving}
                          onClick={handleSubmit}
                        >
                          Salvar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Você esqueceu de preencher os campos acima.</TooltipContent>
                    </Tooltip>
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
