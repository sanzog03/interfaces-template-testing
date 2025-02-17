import { useEffect } from 'react';

import { useChart } from '../../context/chartContext';

export const ChartTitle = ({ children }) => {
  // Displays the title of the chart using the children prop
  // Uses the useChart hook to access the chart object
  const { chart } = useChart();

  useEffect(() => {
    if (!chart.current || !children) return;

    chart.current.config.options.plugins.title.text = children;
    chart.current.config.options.plugins.title.display = true;
    chart.current.update();

  }, [chart, chart.current, children]);

  return null;
};
