import { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { createColorbar } from './helper';
import * as d3 from 'd3';

import './index.css';

export const ColorBar = ({ label, VMIN, VMAX, STEPSIZE = 1, colorMap }) => {
  const colorBarScale = useRef();
  useEffect(() => {
    const STEP = (VMAX - VMIN) / STEPSIZE;
    const colorbar = d3.select(colorBarScale.current);
    createColorbar(colorbar, VMIN, VMAX, STEP, colorMap);

    return () => {
      colorbar.selectAll('*').remove();
    };
  }, [label, VMIN, VMAX, STEPSIZE, colorMap]);

  return (
    <Card id='colorbar'>
      <div ref={colorBarScale} className='colorbar-scale'></div>
      <Typography
        variant='subtitle2'
        gutterBottom
        sx={{ marginBottom: 0 }}
        className='colorbar-label'
      >
        {label}
      </Typography>
    </Card>
  );
};
