import { useEffect, useRef } from 'react';
import { useChart } from '../../context/chartContext';
import { Box } from '@mui/material';
import { options } from './config';
import './index.css';
import { Ticks } from 'chart.js';


export const Chart = ({ id, title, style, datasets }) => {
  const { createChart, zoomLevel } = useChart();
  const canvasRef = useRef(null);
  console.log('datasets', datasets);

  useEffect(() => {
    if (!canvasRef.current) return;
    createChart(id, canvasRef.current, {
      data: {
        labels: datasets[0].labels,
        datasets: datasets.map((dataset, index) => ({
          type: dataset.type,
          label: dataset.dataLegend,
          data: dataset.dataPoints,
          borderColor: dataset.color,
          backgroundColor: dataset.color + '40',
          yAxisID: `y-${index}`,
          xAxisID: `x-${index}`,
          showLine: false,
        })),
        
      },
      options: {
        ...options,
        scales: datasets.reduce((acc, dataset, index) => {
          return {
            ...acc,
            [`x-${index}`]: {
              display: true,
              grid: {
                display: false,
                drawOnChartArea: false,
                color: dataset.color,
              },
              ticks: {
                color: dataset.color,
              },
              title: { text: dataset.xAxisDesc, display: !!dataset.xAxisDesc, color: dataset.color},
            },
            [`y-${index}`]: {
              display: true,
              grid: {
                display: false,
                drawOnChartArea: false,
                color: dataset.color,
              },
              ticks: {
                color: dataset.color,
              },
              title: { text: dataset.yAxisDesc, display: !!dataset.yAxisDesc, color: dataset.color},
            },
          };
        }, {}),
        
        plugins: {
          ...options.plugins,
          title: {
            ...options.plugins.title,
            text: title,
          },
        }, 
        zoom: {
          enabled: true,
          mode: 'xy',
          speed: 0.1
        },
      },
    });
  }, [id, style, datasets, title, zoomLevel, createChart]);

  return (
    <Box id="chart-box" style={style}>
      <canvas ref={canvasRef} id={id} className="fullWidth" />
    </Box>
  );
};
