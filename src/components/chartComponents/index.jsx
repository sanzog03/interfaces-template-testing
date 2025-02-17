import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateLeft, faCircleInfo, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useChart } from '../../context/chartContext';

export const ChartInstruction = () => {
  // Displays instruction for interacting with the chart when the info icon is hovered
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
  
const ZoomResetTool = () => {
  // Resets the zoom level of the chart when the reset zoom icon is clicked
  // Uses the useChart hook to access the chart object
  const { chart } = useChart();

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
  // Closes the chart when the close icon is clicked
  // Receives the handleClose function as a prop
  <FontAwesomeIcon
    id="chart-close-button"
    icon={faXmark}
    title="Close"
    onClick={handleClose}
  />
);

const DataAccessTool = ({ dataAccessLink }) => {
  // Displays a link to the data access page when the data access link is provided
  const [link, setLink] = useState(dataAccessLink);

  useEffect(() => {
    setLink(dataAccessLink);
  }, [dataAccessLink]);
  
  if (!link) return null;

  return (
    <a id="data-access-link" href={link} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faExternalLink} />
    </a>
  );
};
  
export const ChartTools = ({ dataAccessLink, handleClose }) => {
  // Displays the chart tools
  // Receives the data access link and handleClose function as props
  return (
    <div id="chart-tools-right">
      <div id="chart-controls">
        <DataAccessTool dataAccessLink={dataAccessLink} />
        <ZoomResetTool />
        <CloseButton handleClose={handleClose} />
      </div>
    </div>
  );
};
