import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateLeft, faCircleInfo, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useChart } from '../../context/chartContext';

export const ChartInstruction = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    return (
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
  };
  
const ZoomResetTool = ({ chart }) => {
    const handleResetZoom = () => {
    if (chart.current) {
      chart.current.resetZoom();
    }
  };
    return (
    <FontAwesomeIcon
      id="zoom-reset-button"
      icon={faRotateLeft}
      title="Reset Zoom"
      onClick={handleResetZoom}
    />
  );
};

const CloseButton = ({ handleClose }) => (
  <FontAwesomeIcon
    id="chart-close-button"
    icon={faXmark}
    title="Close"
    onClick={handleClose}
  />
);

const DataAccessTool = ({ dataAccessLink }) => (
  dataAccessLink && (
    <a id="data-access-link" href={dataAccessLink} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faExternalLink} />
    </a>
  )
);
  
export const ChartTools = ({ dataAccessLink, handleClose }) => {
  const { chart } = useChart();

  return (
    <div id="chart-tools-right">
      <div id="chart-controls">
        <DataAccessTool dataAccessLink={dataAccessLink} />
        <ZoomResetTool chart={chart} />
        <CloseButton handleClose={handleClose} />
      </div>
    </div>
  );
};
