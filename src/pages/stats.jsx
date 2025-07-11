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
      <DrawerTitle className="text-center mx-auto my-4">Estatísticas</DrawerTitle>
      <div className="w-full flex items-top mb-10 justify-center">
        <Card className="w-full max-w-sm justify-start mx-auto">
          <CardContent className="-mt-4">
            <GlicDaily notes={notes} limit={2} />
            <GlicMinMaxDaily notes={notes} limit={7} />
            <GlicAvgMonthly notes={notes} limit={6} />
            <CarboSumDaily notes={notes} limit={7} />
            <InsuSumDaily notes={notes} limit={7} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
