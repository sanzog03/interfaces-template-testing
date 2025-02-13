import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { options } from '../components/chart/config';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const chartContainer = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) return;

    const config = {
          data: {
            labels: [],
            datasets: [].map((dataset, index) => ({
              type: dataset.type,
              label: dataset.dataLegend,
              data: dataset.dataPoints,
              borderColor: dataset.color,
              backgroundColor: dataset.color + '40',
              yAxisID: `y-${index}`,
              xAxisID: `x-${index}`,
              showLine: false,
            })),
            
          },
          options: {
            ...options,
            scales: [].reduce((acc, dataset, index) => {
              return {
                ...acc,
                [`x-${index}`]: {
                  display: true,
                  grid: {
                    display: false,
                    drawOnChartArea: false,
                    color: dataset.color,
                  },
                  ticks: {
                    color: dataset.color,
                  },
                  title: { text: dataset.xAxisDesc, display: !!dataset.xAxisDesc, color: dataset.color},
                },
                [`y-${index}`]: {
                  display: true,
                  grid: {
                    display: false,
                    drawOnChartArea: false,
                    color: dataset.color,
                  },
                  ticks: {
                    color: dataset.color,
                  },
                  title: { text: dataset.yAxisDesc, display: !!dataset.yAxisDesc, color: dataset.color},
                },
              };
            }, {}),
            
            plugins: {
              ...options.plugins,
              title: {
                ...options.plugins.title,
                text: "TITLE",
              },
            }, 
            zoom: {
              enabled: true,
              mode: 'xy',
              speed: 0.1
            },
          },
    };
    chart.current = new Chart(chartContainer.current, config);

    // Clean up charts on unmount
    return () => {
      chart.current.remove();
    };
  }, []);


  return (
    <ChartContext.Provider value={{ chart: chart.current }}>
      <canvas ref={chartContainer} style={{ width: '100%', minHeight: '30%' }}>
        {children}
      </canvas>
    </ChartContext.Provider>
  );
};

export const useChart = () => useContext(ChartContext);
