import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ChartInstruction, ChartTools } from '../components/chartComponents';
import { plugin } from '../components/mainChart/config';
import { options } from '../components/mainChart/options';

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
          showLine: false,
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
      chart.current.destroy();
    };
  }, []);

  return (
    <ChartContext.Provider value={{ chart: chart }}>
      <ChartInstruction />
      <ChartTools />
      <canvas ref={chartContainer} style={{ width: '100%', minHeight: '30%' }}>
        {children}
      </canvas>
    </ChartContext.Provider>
  );
};

export const useChart = () => useContext(ChartContext);
