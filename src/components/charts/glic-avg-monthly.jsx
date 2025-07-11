import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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
          date: `${glicDate.getMonth() + 1}/${glicDate.getFullYear()}`,
          timestamp: +glicDate
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
      .reverse(),
    ({ date }) => date
  )

  return Object.keys(glicMonthlyData)
    .slice(0, limit)
    .map((date) => {
      const glicsMonthly = glicMonthlyData[date]
      const glics = glicsMonthly.map(({ glic }) => glic).filter((glic) => Boolean(glic))
      const avg = glics.reduce((acc, sum) => acc + sum, 0) / glics.length
      return { date, avg }
    })
}

export const GlicAvgMonthly = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Glicemia média dos últimos {limit} meses</h2>
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart accessibilityLayer data={chartData} layout="vertical">
          <XAxis type="number" dataKey="avg" hide />
          <YAxis dataKey="date" type="category" tickLine={false} tickMargin={5} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="avg" fill="var(--color-avg)" radius={5} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
