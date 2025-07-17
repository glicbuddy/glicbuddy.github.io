import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import config from '@/config'
import { ChartNoAxesCombined, NotebookPen, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export const Actions = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(config.appActions.includes(location.pathname))
  }, [location.pathname])

  const handleOpen = (path) => {
    setOpen(true)
    navigate(path)
  }

  const handleChange = (isOpen) => {
    if (!isOpen) {
      setOpen(false)
      navigate(config.appRoutes.home)
    }
  }

  return (
    <Drawer open={open} repositionInputs={false} onOpenChange={handleChange}>
      <DrawerTrigger asChild>
        <div className="flex flex-col p-2 fixed bottom-1 right-1">
          <Button
            variant="secondary"
            className="size-12 mb-3"
            onClick={() => handleOpen(config.appRoutes.settings)}
          >
            <Settings className="size-5" />
          </Button>
          <Button
            variant="secondary"
            className="size-12 mb-3"
            onClick={() => handleOpen(config.appRoutes.stats)}
          >
            <ChartNoAxesCombined className="size-5" />
          </Button>
          <Button
            variant="default"
            className="size-12 mb-3"
            onClick={() => handleOpen(config.appRoutes.form)}
          >
            <NotebookPen className="size-5" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <Outlet />
      </DrawerContent>
    </Drawer>
  )
}
