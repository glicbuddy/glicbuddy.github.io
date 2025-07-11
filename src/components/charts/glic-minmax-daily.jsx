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
      .map(({ date, glic }) => ({
        glic,
        date: new Date(date).toLocaleDateString(),
        timestamp: +new Date(date)
      }))
      .sort((a, b) => a.timestamp - b.timestamp),
    ({ date }) => date
  )

  return Object.keys(glicDailyData)
    .slice(0, limit)
    .map((date) => ({
      date,
      min: Math.min(...glicDailyData[date].map(({ glic }) => glic)),
      max: Math.max(...glicDailyData[date].map(({ glic }) => glic))
    }))
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
