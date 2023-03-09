import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import './DiabetesForm.css'
import { useState } from 'react';
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import { InfoOutlined } from '@mui/icons-material';
// import VolumeUp from '@mui/icons-material/VolumeUp';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {
  const [value, setValue] = useState(props.default);


  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.HandleStorage(newValue, props.parameter)
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    props.HandleStorage(parseFloat(event.target.value), props.parameter)
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  return (
    <Box sx={{ width: 300 }}>

      <div className=" form-check" style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "0px", fontFamily: "Calibre M", color: "var(--text-color)", fontSize: "24px" }}>
        {props.parameter}
        <div style={{display:"inline-flex",marginLeft:"5px",padding:"1px"}}>
          <Typography
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoOutlined fontSize='small'/>
          </Typography>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
              <div className=" form-check" style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "5px", fontFamily: "Calibre R", color: "var(--text-color)", fontSize: "18px" }}>{props.details}</div>
          </Popover>
        </div>
      </div>

      <Grid container spacing={2} alignItems="center">
        {/* <Grid item>
          <VolumeUp />
        </Grid> */}
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={props.min}
            max={props.max}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="medium"
            onChange={handleInputChange}
            onBlur={handleBlur}
            // color={`var(--text-color)`}
  
            style={
              {fontFamily:"SF Mono",color:'var(--text-color)'}
            }
            inputProps={{
              step: 1,
              min: props.min,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}