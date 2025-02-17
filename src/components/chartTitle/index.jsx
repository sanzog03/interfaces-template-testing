import { useEffect } from 'react';

import { useChart } from '../../context/chartContext';

export const ChartTitle = ({ children }) => {
  // title should be a string
  const { chart } = useChart();

  useEffect(() => {
    if (!chart.current || !children) return;

    chart.current.config.options.plugins.title.text = children;
    chart.current.config.options.plugins.title.display = true;
    chart.current.update();

  }, [chart, chart.current, children]);

  return null;
};
