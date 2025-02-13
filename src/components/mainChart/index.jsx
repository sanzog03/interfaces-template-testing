import { ChartProvider } from '../../context/chartContext';

const MainChart = ({ children }) => {
  return (
    <ChartProvider>
      {/* Other components that need access to the chart */}
      {children}
    </ChartProvider>
  );
};

export default MainChart;
