import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useNotes } from '@/hooks'
import { currentISODateWithTimezone } from '@/lib/date'
import { useState } from 'react'

export const Form = () => {
  const [, { saveNotes, isValidNote }] = useNotes()
  const [blank, setBlank] = useState(false)
  const [saving, setSaving] = useState(false)

  const clearForm = () => {
    document.getElementById('glic').value = ''
    document.getElementById('carbo').value = ''
    document.getElementById('insuFast').value = ''
    document.getElementById('insuBasal').value = ''
  }

  const clearWarnings = () => setBlank(false)

  const handleClose = () => {
    clearForm()
    setBlank(false)
    setSaving(false)
    window.location = '/'
  }

  const handleSave = (newNotes) => {
    saveNotes(newNotes)
    handleClose()
  }

  const handleSubmit = () => {
    setSaving(true)
    setBlank(false)

    const glic = document.getElementById('glic')?.value
    const carbo = document.getElementById('carbo')?.value
    const insuFast = document.getElementById('insuFast')?.value
    const insuBasal = document.getElementById('insuBasal')?.value
    const date = document.getElementById('date')?.value

    if (!isValidNote({ glic, carbo, insuFast, insuBasal, date })) {
      setSaving(false)
      setBlank(true)
      return false
    }

    setTimeout(() => {
      if (insuFast > 0 && insuBasal > 0) {
        handleSave([
          { glic, carbo, insuFast, insuBasal: null, date },
          { glic: null, carbo: null, insuFast: null, insuBasal, date }
        ])
      } else {
        handleSave([{ glic, carbo, insuFast, insuBasal, date }])
      }
    }, 500)
  }

  const currentDate = currentISODateWithTimezone()

  return (
    <div className="w-full flex items-top pt-4 mb-10 justify-center">
      <Card className="w-full max-w-sm justify-start mx-auto">
        <CardContent>
          <DrawerTitle className="text-center mb-4">Novo registro</DrawerTitle>
          <div className="flex gap-6 mb-4">
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
          </div>
          <div className="flex gap-6 mb-4">
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
          <div className="flex gap-6">
            <div className="grid gap-2">
              <Label htmlFor="date">Data e hora</Label>
              <Input
                disabled={saving}
                onFocus={clearWarnings}
                id="date"
                type="datetime-local"
                defaultValue={currentDate.slice(0, 16)}
                className="text-xl font-bold size-10 w-full"
              />
            </div>
          </div>
          <CardFooter className="mt-6 px-0">
            <Button
              variant="ghost"
              disabled={saving}
              className="text-xl size-10 w-1/2"
              onClick={handleClose}
            >
              Cancelar
            </Button>
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
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}
