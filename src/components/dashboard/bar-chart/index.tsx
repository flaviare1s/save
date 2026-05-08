import { Bar } from 'react-chartjs-2'

import '../chart-setup'

type BarChartProps = {
  labels: string[]
  values: number[]
  color: string
}

export const BarChart = ({ labels, values, color }: BarChartProps) => {
  return (
    <div className="h-64 sm:h-72">
      <Bar
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: color,
              borderRadius: 999,
              borderSkipped: false,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#9fb0a3',
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
            y: {
              ticks: {
                color: '#9fb0a3',
              },
              grid: {
                color: 'rgba(255,255,255,0.06)',
              },
              border: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  )
}
