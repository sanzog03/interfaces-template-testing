
import { Box } from '@mui/material';
import { useChart } from '../../context/chartContext';
import { Chart } from '../chart';
import { ChartInstruction, ChartTools } from '../chartComponents';

import './index.css';


export const ChartContainer = ({ chartsData, setDisplayChart, dataAccessLink }) => {
  const { resetZoomForAllCharts } = useChart();

  const handleRefresh = () => {
    resetZoomForAllCharts();
  };

  return (
    <Box id="chart-container" style={{ width: '100%', height: '100%' }}>
      <ChartInstruction />
      <ChartTools dataAccessLink={dataAccessLink} handleRefresh={handleRefresh} handleClose={() => setDisplayChart(false)} />
      {chartsData.map((chartData) => (
        <Chart
          key={chartData.id}
          id={chartData.id}
          title={chartData.title}
          datasets={chartData.datasets}
          style={chartData.style}
        />
      ))}
    </Box>
  );
};
