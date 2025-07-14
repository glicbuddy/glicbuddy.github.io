import {
  CarboSumDaily,
  GlicAvgMonthly,
  GlicDaily,
  GlicMinMaxDaily,
  InsuSumDaily
} from '@/components/charts'
import { Card, CardContent } from '@/components/ui/card'
import { DrawerTitle } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotes } from '@/hooks'

export const Stats = () => {
  const [notes] = useNotes()

  return (
    <ScrollArea className="h-[550px]">
      <div className="w-full flex items-top pt-4 mb-10 justify-center">
        <Card className="w-full px-0 max-w-sm justify-start">
          <CardContent className="px-0">
            <DrawerTitle className="text-center mx-auto mb-4">Estatísticas</DrawerTitle>
            <GlicDaily notes={notes} limit={2} />
            <GlicMinMaxDaily notes={notes} limit={7} />
            <GlicAvgMonthly notes={notes} limit={3} />
            <InsuSumDaily notes={notes} limit={7} />
            <CarboSumDaily notes={notes} limit={7} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
