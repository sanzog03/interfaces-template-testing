import { useEffect } from 'react';
import { useChart } from '../../context/chartContext';

export const LineChart = ({ data, labels, legend, labelX, labelY, color="#ff6384", index=0 }) => {
  // data should be an array of vector points
  // labels should be an array of the vector labels
  const { chart } = useChart();

  useEffect(() => {
    if (!chart.current || !data.length || !labels.length) return;

    // first reset the zoom
    chart.current.resetZoom();
    chart.current.options.plugins.tooltip.enabled = true;

    const newDataset = {
      label: legend,
      data: data,
      backgroundColor: color + '20',
      borderColor: color,
      showLine: false,
      yAxisID: `y-${index}`,
      xAxisID: `x-${index}`,
    };
    // Ensure datasets array exists
    if (!chart.current.data.datasets) {
      chart.current.data.datasets = [];
    }

    // Add dataset at the specified index
    chart.current.data.datasets[index] = newDataset;

    // Update the labels
    chart.current.data.labels = labels;

    // update the axis labels
    chart.current.options.scales.y.display = false;
    chart.current.options.scales.x.display = false;

    // Ensure scales object exists
    if (!chart.current.options.scales) {
      chart.current.options.scales = {};
    }

    // Add scale configurations for x and y axes
    chart.current.options.scales[`x-${index}`] = {
      type: 'category',
      labels: labels,
      display: true,
      grid: {
        display: false,
        drawOnChartArea: false,
        // color: color,
      },
      ticks: {
        labels,
      },
      title: {
        text: labelX,
        display: !!labelX,
        // color: color
      }
    };

    chart.current.options.scales[`y-${index}`] = {
      display: true,
      grid: {
        display: false,
        drawOnChartArea: false,
        // color: color,
      },
      ticks: {
        // color: color,
      },
      title: {
        text: labelY,
        display: !!labelY,
        // color: color
      }
    };

    // update the chart
    chart.current.update();

  }, [chart, chart.current, data, labels, legend, labelX, labelY, color, index]);

  return null;
};
