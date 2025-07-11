import { GlicMinMaxDaily } from '@/components/charts'
import { Card, CardContent } from '@/components/ui/card'
import { DrawerTitle } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotes } from '@/hooks'

export const Stats = () => {
  const [notes] = useNotes()
  console.log('stats', notes)
  return (
    <ScrollArea className="h-[550px]">
      <div className="w-full flex items-top pt-4 mb-10 justify-center">
        <Card className="w-full max-w-sm justify-start mx-auto">
          <CardContent>
            <DrawerTitle className="text-center mb-4">Estatísticas</DrawerTitle>
            <GlicMinMaxDaily notes={notes} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
