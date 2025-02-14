import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { options, plugin } from '../components/chart/config';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const chartContainer = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) return;

    let dataset = {
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          borderColor: '#ff6384',
          yAxisID: 'y',
          showLine: false
        }
      ]
    };

    const config = {
      type: 'line',
      data: dataset,
      options: options,
      plugins: [plugin],
    }

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
