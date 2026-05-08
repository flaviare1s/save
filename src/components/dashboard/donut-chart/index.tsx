import { Doughnut } from 'react-chartjs-2'

import '../chart-setup'

type DonutChartProps = {
  labels: string[]
  values: number[]
  colors: string[]
}

export const DonutChart = ({ labels, values, colors }: DonutChartProps) => {
  return (
    <div className="h-64 sm:h-72">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#f5ffe7',
                padding: 16,
                usePointStyle: true,
              },
            },
          },
        }}
      />
    </div>
  )
}
