import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./index.css";

export function Dropdown({ id, options, selectedValue, setSelectedValue, style }) {
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Box class="dropdown-box" sx={{ minWidth: 120, maxWidth: 240 }} style={style}>
      <FormControl fullWidth>
        <Select
          value={selectedValue}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Dropdown' }}
        >
          {Object.keys(options).map((key) => (
            <MenuItem key={key} value={key}>{options[key]}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}