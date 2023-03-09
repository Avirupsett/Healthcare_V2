import React from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { Route, useRouteMatch } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import HeartDetails from './HeartDetails';
import HeartDisease from './HeartDisease';
import HeartDiet from './HeartDiet';
import './HeartForm.css'


const steps = [
    'Step 1',
    'Step 2',
    'Step 3'
  ];

export default function HeartForm() {
  const match = useRouteMatch({
    path: "/heartform/details",
    strict: true,
    sensitive: true
});
const match2 = useRouteMatch({
  path: "/heartform/disease",
  strict: true,
  sensitive: true
});


  
  return (
    <div className='steppers' style={{marginTop:window.innerWidth>800?"-10px":"-15px"}}>
       <Box sx={{ '& .MuiStepLabel-root .Mui-completed': {
            color: 'var(--first-color)', // circle color (COMPLETED)
            fontFamily:"SF Mono",
          },
          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
            {
              color: 'var(--text-color)', // Just text label (COMPLETED)
              fontFamily:"SF Mono",
              fontSize:window.innerWidth>700? "16px":"13px",
              visibility:window.innerWidth>800? "visible":"hidden"
            },
          '& .MuiStepLabel-root .Mui-active': {
            color: 'var(--first-color)', // circle color (ACTIVE)
            fontFamily:"SF Mono"
          },
          '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
            {
              color: 'var(--heading-color)', // Just text label (ACTIVE)
              fontWeight:'bold',
              fontFamily:"SF Mono",
              fontSize:window.innerWidth>700? "18px":"14px",
              visibility:window.innerWidth>800? "visible":"hidden"
            },
          '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
            fill: 'var(--white-color)', // circle's number (ACTIVE)
            fontFamily:"SF Mono"
          },
          '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel':{
            fontFamily:"SF Mono",
            color: 'var(--text-color)',
            fontSize:window.innerWidth>700? "16px":"13px",
            visibility:window.innerWidth>800? "visible":"hidden"
          }
          }}>
      <Stepper activeStep={match?0:match2?1:2} alternativeLabel style={{marginBottom:window.innerWidth>800?"-35px":"-40px"}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
    <AnimatePresence>
      <Route key={"heartdetails"} exact path="/heartform/details">
          <HeartDetails/>
      </Route>
      <Route key={"heartdisease"} exact path="/heartform/disease">
          <HeartDisease/>
      </Route>
      <Route key={"heartdiet"} exact path="/heartform/diet">
          <HeartDiet/>
      </Route>
      {/* <Route key={"disease"} exact path="/diabetes_form/disease">
          <Disease/>
      </Route>
      <Route key={"medication"} exact path="/diabetes_form/medication">
          <Medication/>
      </Route> */}
    </AnimatePresence>
  
    </div>
  );
};

