import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  fast: {
    label: 'Insu. rápida',
    color: '#FA1F54'
  },
  basal: {
    label: 'Insu. basal',
    color: '#FFA1AD'
  }
}

function process(data, limit) {
  const insuDailyData = Object.groupBy(
    data
      .map(({ date, insuFast, insuBasal }) => {
        const insuDate = new Date(date)
        return {
          insuFast,
          insuBasal,
          date: insuDate.toLocaleDateString().slice(0, 5),
          timestamp: +insuDate
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp),
    ({ date }) => date
  )

  return Object.keys(insuDailyData)
    .slice(0, limit)
    .map((date) => {
      const insuDaily = insuDailyData[date]
      return {
        date,
        basal: insuDaily.map(({ insuBasal }) => insuBasal).reduce((acc, sum) => acc + sum, 0),
        fast: insuDaily.map(({ insuFast }) => insuFast).reduce((acc, sum) => acc + sum, 0)
      }
    })
}

export const InsuSumDaily = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Insulina rápida/basal dos últimos {limit} dias</h2>
      <ChartContainer config={chartConfig} className="min-h-[250px] px-0 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="basal" stackId="a" fill="var(--color-fast)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="fast" stackId="a" fill="var(--color-basal)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
