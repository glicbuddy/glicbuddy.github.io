import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  total: {
    label: 'Total',
    color: '#FA1F54'
  }
}

function process(data, limit) {
  const carboDailyData = Object.groupBy(
    data
      .map(({ date, carbo }) => {
        const carboDate = new Date(date)
        return {
          carbo,
          date: carboDate.toLocaleDateString(),
          timestamp: +carboDate
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp),
    ({ date }) => date
  )

  return Object.keys(carboDailyData)
    .slice(0, limit)
    .map((date) => {
      const carbosDaily = carboDailyData[date]
      return {
        date,
        total: carbosDaily.map(({ carbo }) => carbo).reduce((acc, sum) => acc + sum, 0)
      }
    })
}

export const CarboSumDaily = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Carboidratos dos últimos {limit} dias</h2>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
