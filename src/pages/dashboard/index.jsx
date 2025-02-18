import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Title } from '../../components/title';
import MainChart from '../../components/mainChart';
import { LineChart } from '../../components/lineChart';
import { ChartInstruction, ChartTools, ChartToolsLeft, ChartToolsRight,
  ChartTitle, DataAccessTool, ZoomResetTool, CloseButton } from '../../components/chartComponents';

import './index.css';

export function Dashboard({
  stations,
  selectedStationId,
  setSelectedStationId,
  ghg,
  agency,
  region,
  stationCode,
  setSelectedGHG,
  zoomLevel,
  stationMetadata,
  data,
  labels
}) {
  const [displayChart, setDisplayChart] = useState(true);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  const handleClose = () => {
    setDisplayChart(false);
  }

  return (
    <Box className='fullSize' style={{ }}>
      <Title ghg={ghg} agency={agency} region={region} />
    
      <PanelGroup direction='vertical' className='panel-wrapper'>
        <Panel
          id='map-panel'
          maxSize={100}
          defaultSize={100}
          minSize={25}
          className='panel'
          order={1}
        >
          <div id='dashboard-map-container'></div>
        </Panel>
        {displayChart && (
          <>
            <PanelResizeHandle className='resize-handle'>
              <DragHandleIcon title='Resize' />
            </PanelResizeHandle>

            <Panel
              id='chart-panel'
              maxSize={75}
              minSize={40}
              className='panel panel-timeline'
              order={2}
            >
              <MainChart>
                <div className="chart-container">
                  {/* Instructions and Tools container */}
                    <div className="chart-tools-container">
                        <ChartToolsLeft>
                          <ChartInstruction />
                        </ChartToolsLeft>
                        <ChartToolsRight>
                          <DataAccessTool dataAccessLink={'https://www.google.com'} />
                          <ZoomResetTool />
                          <CloseButton handleClose={handleClose} />
                        </ChartToolsRight>
                    </div>

                  {/* Main chart container */}
                  <div className="main-chart-container">
                    <ChartTitle>My Chart</ChartTitle>
                    <LineChart
                      data={[1, 2, 3]}
                      labels={['a', 'b', 'c']}
                      legend={"daily insitu"}
                      labelX={"date-time"}
                      labelY={"concentration"}
                      index={0}
                    />
                    <LineChart
                      data={[2, 5, 6]}
                      labels={['d', 'e', 'f']}
                      labelX={"date-time"}
                      color={'#878700'}
                      index={1}
                    />
                  </div>
                </div>
              </MainChart>
            </Panel>
          </>
        )}
      </PanelGroup>
    </Box>
  );
}
