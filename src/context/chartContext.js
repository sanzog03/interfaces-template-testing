import { createContext, useContext, useRef, useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const chartInstances = useRef({});
  const [zoomLevel, setZoomLevel] = useState(1);

  const createChart = (id, canvas, config) => {
    if (!canvas) return;

    if (chartInstances.current[id]) {
      chartInstances.current[id].destroy();
    }
    chartInstances.current[id] = new Chart(canvas, config);
  };

  const getChart = (id) => chartInstances.current[id];

  const resetZoomForAllCharts = () => {
    Object.values(chartInstances.current).forEach((chart) => {
      chart.resetZoom();
    });
  };

  useEffect(() => {
    // Clean up charts on unmount
    return () => {
      Object.values(chartInstances.current).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <ChartContext.Provider value={{ createChart, getChart, zoomLevel, setZoomLevel, resetZoomForAllCharts }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = () => useContext(ChartContext);
