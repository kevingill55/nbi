import React, { memo } from "react";
import { Bar } from "react-chartjs-2";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

type BarComponentProps = {
  values3: number[];
  values4: number[];
  values5: number[];
  values6: number[];
  values7: number[];
  labels: string[];
};

const options = {
  plugins: {
    legend: {
      labels: {
        padding: 24,
        boxHeight: 18,
      },
      position: "bottom" as const,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      beginAtZero: true,
      stacked: true,
    },
  },
};

const BarComponent = memo(function BarComponent(props: BarComponentProps) {
  const { labels, values3, values4, values5, values6, values7 } = props;
  return (
    <Bar
      options={options}
      redraw={false}
      data={{
        labels,
        datasets: [
          {
            label: ">= 7",
            data: [...values7],
          },
          {
            label: "6",
            data: [...values6],
          },
          {
            label: "5",
            data: [...values5],
          },
          {
            label: "4",
            data: [...values4],
          },
          {
            label: "<= 3",
            data: [...values3],
          },
        ],
      }}
    />
  );
});

export default BarComponent;
