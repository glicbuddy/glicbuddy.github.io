import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  glic: {
    label: 'Glicemia',
    color: '#FFA1AD'
  }
}

function process(data, limit) {
  const limitDates = Object.keys(
    Object.groupBy(data, ({ date }) => new Date(date).toLocaleDateString())
  ).slice(0, limit)

  return data
    .filter(({ date }) => limitDates.includes(new Date(date).toLocaleDateString()))
    .filter(({ glic }) => Boolean(glic))
    .map(({ date, glic }) => {
      const glicDate = new Date(date)
      return {
        glic,
        date: glicDate.toLocaleString(),
        timestamp: +glicDate
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

export const GlicDaily = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Glicemia dos últimas 7 dias</h2>
      <ChartContainer config={chartConfig} className="min-h-[250px] px-0 w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={true}
            axisLine={false}
            tickMargin={5}
            tickFormatter={(date) => date.slice(0, 5)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Area
            dataKey="glic"
            type="linear"
            fill="var(--color-glic)"
            fillOpacity={0.4}
            stroke="var(--color-glic)"
          />
        </AreaChart>
      </ChartContainer>
    </>
  )
}
