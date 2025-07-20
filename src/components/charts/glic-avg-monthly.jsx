import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  avg: {
    label: 'Média',
    color: '#FA1F54'
  }
}

function process(data, limit) {
  const glicMonthlyData = Object.groupBy(
    data
      .map(({ date, glic }) => {
        const glicDate = new Date(date)
        return {
          glic,
          date: glicDate.toLocaleDateString().slice(3),
          timestamp: +glicDate
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
      .reverse(),
    ({ date }) => date
  )

  return Object.keys(glicMonthlyData)
    .slice(-limit)
    .map((date) => {
      const glicsMonthly = glicMonthlyData[date]
      const glics = glicsMonthly.map(({ glic }) => glic).filter((glic) => Boolean(glic))
      const avg = Math.round(glics.reduce((acc, sum) => acc + sum, 0) / glics.length)
      return { date, avg }
    })
}

export const GlicAvgMonthly = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Glicemia média dos últimos {limit} meses</h2>
      <ChartContainer config={chartConfig} className="min-h-[250px] px-0 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="avg" fill="var(--color-avg)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
