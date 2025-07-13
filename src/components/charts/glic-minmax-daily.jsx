import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
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
          date: glicDate.toLocaleDateString().slice(0, 5),
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
      <ChartContainer config={chartConfig} className="min-h-[250px] px-0 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={5} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="min" stackId="a" fill="var(--color-min)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="max" stackId="a" fill="var(--color-max)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
