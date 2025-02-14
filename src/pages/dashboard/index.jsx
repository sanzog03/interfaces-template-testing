import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Title } from '../../components/title';
import MainChart from '../../components/mainChart';
import { LineChart } from '../../components/lineChart';

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
  const [displayChart, setDisplayChart] = useState(false);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  const chartsData = [
    {
      id: 'chart-1',
      title: 'My Awesome Chart',
      datasets: [
        {
          type: 'line',
          dataPoints: [
            10, 20, 30, 25, 50, 60, 55, 70, 65, 80, 90, 85, 100, 110, 105, 120,
            125, 140, 135, 150, 160, 155, 170, 180, 175, 190, 200, 195, 210,
            220, 215, 230, 240, 235, 250, 260, 255, 270, 280, 275, 290, 300,
          ],
          dataLegend: 'Sales by Month',
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
          ],
          yAxisDesc: '',
          xAxisDesc: 'Observation Date/Time (UTC)',
          color: '#FF6384',
        },
        {
          type: 'bar',
          dataPoints: [
            10, 20, 30, 25, 50, 60, 55, 70, 65, 80, 90, 85, 100, 110, 105, 120,
            125, 140, 135, 150, 160, 155, 170, 180, 175, 190, 200, 195, 210,
            220, 215, 230, 240, 235, 250, 260, 255, 270, 280, 275, 290, 300,
          ],
          dataLegend: 'Sales by Month',
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
          ],
          yAxisDesc: 'Sales',
          xAxisDesc: '',
          color: '#208520',
        },
      ],
      style: { width: '100%', height: '100%' },
    },
  ];

  return (
    <Box className='fullSize' style={{ backgroundColor: 'gray' }}>
      <Title ghg={ghg} agency={agency} region={region} />
      <img
        src={process.env.PUBLIC_URL + '/nist.png'}
        alt='NIST'
        className='logo'
      />
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
              <LineChart data={[1, 2, 3]} labels={['a', 'b', 'c']} legend={"daily insitu"} labelX={"date-time"} labelY={"concentration"} />
            </MainChart>
          </Panel>
        </>
      </PanelGroup>
    </Box>
  );
}
