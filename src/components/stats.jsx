import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Stats = ({ title }) => {
  return (
    <ScrollArea className="h-[550px]">
      <div className="w-full flex items-top pt-4 mb-10 justify-center">
        <Card className="w-full max-w-sm justify-start mx-auto">
          <CardContent>
            {title}
            <div className="flex flex-col gap-6">Stats</div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
