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
  )
    .reverse()
    .slice(0, limit)

  return data
    .filter(({ date }) => limitDates.includes(new Date(date).toLocaleDateString()))
    .map(({ date, glic }) => ({
      glic,
      time: `${new Date(date).getHours()}:${new Date(date).getMinutes()}`,
      timestamp: +new Date(date)
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

export const GlicDaily = ({ notes, limit }) => {
  const chartData = process(notes, limit)

  return (
    <>
      <h2 className="text-center my-5">Glicemia dos últimos {limit} dias</h2>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
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
