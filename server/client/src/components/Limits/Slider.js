import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
//adjusted https://material-ui.com/components/slider/
const useStyles = makeStyles({
   root: {
      width: 400,
   },
   input: {
      width: 60,
   },
});

export function InputSlider({
   headding,
   setValueToParentElement,
   min,
   max,
   unit,
   step,
}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(min);

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      setValueToParentElement(newValue);
   };

   const handleInputChange = (event) => {
      if (event.target.value === "") {
         setValue("");
      } else {
         setValue(Number(event.target.value));
         setValueToParentElement(Number(event.target.value));
      }
   };

   const handleBlur = () => {
      if (value < min) {
         setValue(min);
      } else if (value > max) {
         setValue(max);
      }
   };

   const stepValue = () => (max - min < 100 ? (max - min < 10 ? 0.01 : 0.1) : 1);

   return (
      <div className={classes.root}>
         {headding} ({unit})
         <Grid container spacing={2} alignItems="center">
            <Grid item xs>
               <Slider
                  value={typeof value === "number" ? value : 0}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  max={max}
                  min={min}
                  step={stepValue()}
               />
            </Grid>
            <Grid item>
               <Input
                  className={classes.input}
                  value={value}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                     step: step,
                     min: min,
                     max: max,
                     type: "number",
                     "aria-labelledby": "input-slider",
                  }}
               />
            </Grid>
         </Grid>
      </div>
   );
}

export function InputSliderWithSwitch({
   headding,
   setValueToParentElement,
   min,
   max,
   unit,
   step,
}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(min);
   const [shouldBeNull, setShouldBeNull] = React.useState(true);

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      setValueToParentElement(newValue);
   };

   const handleMakeNullToggle = (event) => {
      setShouldBeNull(!shouldBeNull);
      if(!shouldBeNull){
         setValueToParentElement(null);
      } else {
         setValueToParentElement(value);
      }
   };

   const handleInputChange = (event) => {
      if (event.target.value === "") {
         setValue("");
      } else {
         setValue(Number(event.target.value));
         setValueToParentElement(Number(event.target.value));
      }
   };

   const handleBlur = () => {
      if (value < min) {
         setValue(min);
      } else if (value > max) {
         setValue(max);
      }
   };

   const stepValue = () => (max - min < 100 ? (max - min < 10 ? 0.01 : 0.1) : 1);

   return (
      <div className={classes.root}>
         <Switch
            size="small"
            color="primary"
            onChange={handleMakeNullToggle}
         />
         {headding} ({unit})
         {!shouldBeNull ? (
         (<Grid container spacing={2} alignItems="center">
            <Grid item xs>
               <Slider
                  value={typeof value === "number" ? value : 0}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  max={max}
                  min={min}
                  step={stepValue()}
               />
            </Grid>
            <Grid item>
               <Input
                  className={classes.input}
                  value={value}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                     step: step,
                     min: min,
                     max: max,
                     type: "number",
                     "aria-labelledby": "input-slider",
                  }}
               />
            </Grid>
         </Grid>)): <div style={{marginBottom: "25px"}}></div>}
      </div>
   );
}
