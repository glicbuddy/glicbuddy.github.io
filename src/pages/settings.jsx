import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DrawerTitle } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import config from '@/config'
import { useNotes } from '@/hooks'
import { ArchiveRestore, History, Trash2 } from 'lucide-react'

export const Settings = () => {
  const [notes, { setNotes, restoreNotes }] = useNotes()

  const handleBackup = (e) => {
    e.preventDefault()
    const data = JSON.stringify(notes)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.appName.toLowerCase()}-backup-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('Backup gerado com sucesso!')
  }

  const handleRestore = (e) => {
    e.preventDefault()
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = JSON.parse(e.target.result)
            if (!restoreNotes(content)) {
              alert('Este arquivo não é um backup válido.')
              return
            }
            alert('Backup restaurado com sucesso!')
            window.location = config.appRoutes.home
          } catch (error) {
            console.error(error)
            alert('Este arquivo não é um backup válido.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClear = (e) => {
    e.preventDefault()
    if (confirm('Você tem certeza que deseja apagar todos os dados?')) {
      setNotes([])
      alert('Todos os dados foram apagados.')
      window.location = config.appRoutes.home
    }
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="w-full flex items-top pt-4 px-0 mb-10 justify-center">
        <Card className="w-full pr-2 mx-0 max-w-sm justify-start">
          <CardContent className="px-2">
            <DrawerTitle className="text-center mx-auto mb-4">Configurações</DrawerTitle>
            <Button
              variant="secondary"
              className="w-full mb-4"
              onClick={handleClear}
              disabled={!notes.length}
            >
              <Trash2 className="mr-2 size-4" />
              Apagar dados
            </Button>
            <Button
              variant="secondary"
              className="w-full mb-4"
              onClick={handleBackup}
              disabled={!notes.length}
            >
              <History className="mr-2 size-4" />
              Fazer backup
            </Button>
            <Button variant="secondary" className="w-full mb-4" onClick={handleRestore}>
              <ArchiveRestore className="mr-2 size-4" />
              Restaurar backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
