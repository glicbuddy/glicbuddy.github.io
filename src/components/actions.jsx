import { Form } from '@/components/form'
import { Stats } from '@/components/stats'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { ChartNoAxesCombined, NotebookPen } from 'lucide-react'
import { useState } from 'react'

const ACTIONS = {
  FORM: 'form',
  STATS: 'stats'
}

export const Actions = ({ onSave }) => {
  const [action, setAction] = useState(null)

  const handleOpen = (actionType) => setAction(actionType)
  const handleClose = () => setAction(null)
  const handleChange = (isOpen) => {
    if (!isOpen) {
      handleClose()
    }
  }

  const renderAction = () => {
    if (action === ACTIONS.FORM) {
      return (
        <Form
          onSave={onSave}
          onClose={handleClose}
          title={<DrawerTitle className="text-center mb-4">Novo registro</DrawerTitle>}
        />
      )
    }
    if (action === ACTIONS.STATS) {
      return <Stats title={<DrawerTitle className="text-center mb-4">Estatísticas</DrawerTitle>} />
    }
    return null
  }

  const isOpen = Boolean(action)

  return (
    <Drawer open={isOpen} repositionInputs={false} onOpenChange={handleChange}>
      <DrawerTrigger asChild>
        <div className="flex flex-col p-2 fixed bottom-1 right-1">
          <Button
            variant="secondary"
            className="size-12 mb-3"
            onClick={() => handleOpen(ACTIONS.STATS)}
          >
            <ChartNoAxesCombined className="size-5" />
          </Button>
          <Button
            variant="default"
            className="size-12 mb-3"
            onClick={() => handleOpen(ACTIONS.FORM)}
          >
            <NotebookPen className="size-5" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>{renderAction()}</DrawerContent>
    </Drawer>
  )
}
