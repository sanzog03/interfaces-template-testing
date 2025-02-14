import { useEffect } from 'react';

import { useChart } from '../../context/chartContext';

export const LineChart = ({ data, labels, legend, labelX, labelY, color="#ff6384", index=0 }) => {
  // data should be an array of vector points
  // labels should be an array of the vector labels
  const { chart } = useChart();

  useEffect(() => {
    if (!chart || !data.length || !labels.length) return;

    // first reset the zoom
    chart.resetZoom();
    chart.options.plugins.tooltip.enabled = false;

    chart.data.datasets[0].label = legend;
    chart.options.scales.y.title.text = labelX;
    chart.options.scales.x.title.text = labelY;
    // update that value in the chart.
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;

    // update the chart
    chart.update();

  }, [chart, data, labels, legend, labelX, labelY, color, index]);

  return null;
};
