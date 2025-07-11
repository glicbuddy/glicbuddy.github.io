import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

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

export const GlicMinMaxDaily = ({ notes }) => {
  if (notes?.length) {
    const glicDailyData = Object.groupBy(
      notes.map(({ date, glic }) => ({
        glic,
        date: new Date(date).toLocaleDateString()
      })),
      ({ date }) => date
    )

    const chartData = Object.keys(glicDailyData)
      .reverse()
      .map((date) => ({
        date,
        min: Math.min(...glicDailyData[date].map(({ glic }) => glic)),
        max: Math.max(...glicDailyData[date].map(({ glic }) => glic))
      }))

    return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="min" fill="var(--color-min)" radius={4} />
          <Bar dataKey="max" fill="var(--color-max)" radius={4} />
        </BarChart>
      </ChartContainer>
    )
  }

  return null
}
