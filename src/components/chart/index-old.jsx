import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading';
import { fetchAllFromFeaturesAPI } from "../../services/api";

import { plugin, options } from './config';
import { dataPreprocess, getYAxisLabel, getChangedGHGStationId, getStationCode, isChartZoomed } from "./helper";
import './index.css';

const collectionItemURL = (collectionId) => {
  return `${process.env.REACT_APP_FEATURES_API_URL}/collections/${collectionId}/items?is_max_height_data=True`;
};

export const ConcentrationChart = ({ selectedStationId, ghg, stationMetadata, setDisplayChart, style }) => {
  const chartCanvas = useRef(null);
  const chartRef = useRef(null);
  const initialScaleLimits = useRef({});

  const [showChartInstructions, setShowChartInstructions] = useState(true);
  const [chartDataIsLoading, setChartDataIsLoading] = useState(false);
  const [dataAccessLink, setDataAccessLink] = useState("");

  useEffect(() => {
    initializeChart();
    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data.labels = [];
      chartRef.current.data.datasets[0].data = [];
      chartRef.current.update();
    }
    prepareChart();
  }, [selectedStationId, ghg]);

  const initializeChart = () => {
    chartRef.current?.destroy();
    let dataPointLabel = getYAxisLabel(ghg);

    chartRef.current = new Chart(chartCanvas.current, {
      type: 'line',
      data: { labels: [], datasets: [{ label: dataPointLabel, data: [], borderColor: "#ff6384", yAxisID: 'y', showLine: false }] },
      options: options,
      plugins: [plugin]
    });

    chartRef.current.options.scales.y.title.text = dataPointLabel;
    chartRef.current.options.plugins.zoom.zoom.onZoom = () => setShowChartInstructions(false);
    chartRef.current.options.plugins.zoom.zoom.onZoomComplete = () => {
      chartRef.current.options.plugins.tooltip.enabled = isChartZoomed(chartRef.current, initialScaleLimits.current);
    };

    prepareChart();
  };

  const prepareChart = async () => {
    let currentStationId = getChangedGHGStationId(selectedStationId, ghg);
    setDataAccessLinkFromId(currentStationId);
    changeTitle(currentStationId);
    try {
      let { time, concentration } = await fetchStationData(currentStationId);
      changeTitle(currentStationId);
      updateChart(concentration, time);
      setInitialScaleLimits();
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  const updateChart = (data, label) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      chartRef.current.options.plugins.tooltip.enabled = false;
      let labelY = getYAxisLabel(ghg);
      chartRef.current.data.datasets[0].label = labelY;
      chartRef.current.options.scales.y.title.text = labelY;
      chartRef.current.data.labels = label;
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
    }
  };

  const fetchStationData = async (stationId) => {
    setChartDataIsLoading(true);
    let result = await fetchAllFromFeaturesAPI(collectionItemURL(stationId));
    setChartDataIsLoading(false);
    return dataPreprocess(result);
  };

  const changeTitle = (stationId) => {
    const stationCode = getStationCode(stationId);
    const stationProperties = stationMetadata[stationCode] || {};
    const { station_name: stationName, city, state } = stationProperties;
    if (stationName) {
      let title = stationName.includes(city) ? `${stationName}, ${state} (${stationCode})` : `${stationName}, ${city}, ${state} (${stationCode})`;
      chartRef.current.options.plugins.title.text = title;
      chartRef.current.update();
    }
  };

  const setDataAccessLinkFromId = (stationId) => {
    const stationCode = getStationCode(stationId);
    setDataAccessLink(stationMetadata[stationCode]?.data_link || "");
  };

  const handleRefresh = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      chartRef.current.options.plugins.tooltip.enabled = false;
      chartRef.current.update();
    }
  };
  

  const handleClose = () => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Properly clean up chart before unmounting
    }
    setDisplayChart(false);
  };

  const setInitialScaleLimits = () => {
    initialScaleLimits.current = {
      x: { min: chartRef.current.scales.x.min, max: chartRef.current.scales.x.max },
      y: { min: chartRef.current.scales.y.min, max: chartRef.current.scales.y.max }
    };
  };

  return (
    <Box id="chart-box" style={style}>
      <div id="chart-container" style={{ width: "100%", height: "100%" }}>
        <div id="chart-tools">
          <div id="chart-tools-left">
            <div id="chart-instructions-container">
              <div className="icon-and-instructions">
                <FontAwesomeIcon icon={faCircleInfo} onMouseEnter={() => setShowChartInstructions(true)} onMouseLeave={() => setShowChartInstructions(false)} />
                {showChartInstructions && (
                  <div id="chart-instructions">
                    <p>1. Click and drag, scroll or pinch on the chart to zoom in.</p>
                    <p>2. Hover over data points when zoomed in to see the values.</p>
                    <p>3. Click on the rectangle boxes on the side to toggle chart.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="chart-tools-right">
            {dataAccessLink && <a id="data-access-link" href={dataAccessLink} target="_blank" rel='noreferrer'>Data Access Link ↗</a>}
            <div id="chart-controls">
              <FontAwesomeIcon id="zoom-reset-button" icon={faRotateLeft} title="Reset Zoom" onClick={handleRefresh} />
              <FontAwesomeIcon id="chart-close-button" icon={faXmark} title="Close" onClick={handleClose} />
            </div>
          </div>
        </div>
        {chartDataIsLoading && <LoadingSpinner />}
        <canvas id="chart" className='fullWidth' style={{ width: "100%", height: "100%" }} ref={chartCanvas} />
      </div>
    </Box>
  );
};
