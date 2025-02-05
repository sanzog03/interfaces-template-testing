import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading';
import { plugin, options } from './config';
import './index.css';

export const LineChart = ({ dataPoints, labels, title, yAxisLabel, setDisplayChart, dataAccessLink, style }) => {
  const chartCanvas = useRef(null);
  const chartRef = useRef(null);
  const initialScaleLimits = useRef({});
  const [showChartInstructions, setShowChartInstructions] = useState(true);
  const [chartDataIsLoading, setChartDataIsLoading] = useState(false);

  useEffect(() => {
    initializeChart();
    return () => chartRef.current?.destroy();
  }, []);
  

  useEffect(() => {
    updateChart(dataPoints, labels);
  }, [dataPoints, labels]);

  const initializeChart = () => {
    chartRef.current?.destroy();
    chartRef.current = new Chart(chartCanvas.current, {
      type: 'line',
      data: { labels: [], datasets: [{ label: yAxisLabel, data: [], borderColor: "#ff6384", yAxisID: 'y', showLine: false }] },
      options: options,
      plugins: [plugin],
      scales: { y: { title: { text: yAxisLabel, display: true } } }
      });
  };

  const updateChart = (data, label) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      chartRef.current.data.labels = label;
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.options.scales.y.title.text = yAxisLabel;
      chartRef.current.options.plugins.title.text = title;
      chartRef.current.update();
    }
  };

  const handleRefresh = () => {
    chartRef.current?.resetZoom();
    chartRef.current.options.plugins.tooltip.enabled = false;
  };

  return (
    <Box id="chart-box" style={style}>
      <div id="chart-container" style={{ width: "100%", height: "100%" }}>
            <ChartInstruction showInstructions={showChartInstructions} setShowInstructions={setShowChartInstructions} />
            <ChartTools dataAccessLink={dataAccessLink} handleRefresh={handleRefresh} handleClose={() => setDisplayChart(false)} />
            {chartDataIsLoading && <LoadingSpinner />}
            <canvas id="chart" className='fullWidth' ref={chartCanvas} />
      </div>
    </Box>
  );
};

export const ChartInstruction = ({ showInstructions, setShowInstructions }) => (
  <div id="chart-instructions-container">
    <div className="icon-and-instructions">
      <FontAwesomeIcon icon={faCircleInfo} onMouseEnter={() => setShowInstructions(true)} onMouseLeave={() => setShowInstructions(false)} />
      {showInstructions && (
        <div id="chart-instructions">
          <p>1. Click and drag, scroll or pinch on the chart to zoom in.</p>
          <p>2. Hover over data points when zoomed in to see the values.</p>
          <p>3. Click on the rectangle boxes on the side to toggle chart.</p>
        </div>
      )}
    </div>
  </div>
);

export const ChartTools = ({ dataAccessLink, handleRefresh, handleClose }) => (
  <div id="chart-tools-right">
    {dataAccessLink && (
      <a id="data-access-link" href={dataAccessLink} target="_blank" rel="noreferrer">
        Data Access Link ↗
      </a>
    )}
    <div id="chart-controls">
      <FontAwesomeIcon id="zoom-reset-button" icon={faRotateLeft} title="Reset Zoom" onClick={handleRefresh} />
      <FontAwesomeIcon id="chart-close-button" icon={faXmark} title="Close" onClick={handleClose} />
    </div>
  </div>
);
