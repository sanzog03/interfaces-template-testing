import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

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