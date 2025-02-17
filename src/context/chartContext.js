import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ChartInstruction, ChartTools } from '../components/chartComponents';
import { plugin } from '../components/mainChart/customPlugin';
import { options } from '../components/mainChart/options';
import '../components/mainChart/config';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const chartContainer = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chart) return;

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

    let chart_instance = new Chart(chartContainer.current, config);

    setChart(chart_instance)

    // Clean up charts on unmount
    return () => {
      chart.destroy();
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
