import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  min: {
    label: 'Mínima',
    color: '#FFA1AD'
  },
  max: {
    label: 'Máxima',
    color: '#FA1F54'
  }
}

function process(data, limit) {
  const glicDailyData = Object.groupBy(
    data
      .map(({ date, glic }) => {
        const glicDate = new Date(date)
        return {
          glic,
          date: glicDate.toLocaleDateString(),
          timestamp: +glicDate
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp),
    ({ date }) => date
  )

  return Object.keys(glicDailyData)
    .slice(0, limit)
    .map((date) => {
      const glicsDaily = glicDailyData[date]
      const glics = glicsDaily.map(({ glic }) => glic).filter((glic) => Boolean(glic))
      return { date, min: Math.min(...glics), max: Math.max(...glics) }
    })
}

export const GlicMinMaxDaily = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Glicemia mín/máx dos últimos {limit} dias</h2>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="min" fill="var(--color-min)" radius={4} />
          <Bar dataKey="max" fill="var(--color-max)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
