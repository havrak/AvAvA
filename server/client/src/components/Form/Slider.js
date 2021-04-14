import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import { HelpIcon } from "components/Icons/ClickableIcons";
import { notify } from "superagent";
//adjusted https://material-ui.com/components/slider/
const useStyles = makeStyles({
   root: {
      width: 400,
   },
   input: {
      width: 63,
   },
});

export function InputSlider({
   headding,
   setValueToParentElement,
   initialValue,
   min,
   max,
   unit,
   step,
   helperTooltipText,
}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(
      initialValue !== null && initialValue !== undefined ? initialValue : min
   );

   const marks =
      initialValue !== null && initialValue !== undefined
         ? [
              {
                 value: initialValue,
                 label: `${initialValue}${unit}`,
              },
           ]
         : null;

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      setValueToParentElement(newValue);
   };
   if (min > max) {
      notify(`minimum number of resources needed for ${headding} is greater than maximum`)
      return null;
   } else if (value < min) {
      handleSliderChange(null, min);
   } else if (value > max) {
      handleSliderChange(null, max);
   }

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
         {headding} ({unit}){" "}
         {helperTooltipText ? <HelpIcon tooltipText={helperTooltipText} /> : ""}
         <Grid container spacing={2} alignItems="center">
            <Grid item xs>
               <Slider
                  value={value}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  max={max}
                  min={min}
                  marks={marks}
                  step={stepValue()}
               />
            </Grid>
            <Grid item>
               <Input
                  className={classes.input}
                  value={value}
                  margin="dense"
                  onChange={(e) => handleInputChange(e)}
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
   initialValue,
   unit,
   step,
   helperTooltipText,
}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(
      initialValue !== null && initialValue !== undefined ? initialValue : min
   );
   const [shouldBeNull, setShouldBeNull] = React.useState(
      initialValue !== null && initialValue !== undefined ? false : true
   );

   const marks =
      initialValue !== null && initialValue !== undefined
         ? [
              {
                 value: initialValue,
                 label: `${initialValue}${unit}`,
              },
           ]
         : null;

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      setValueToParentElement(newValue);
   };

   const handleMakeNullToggle = (event) => {
      setShouldBeNull(!shouldBeNull);
      if (!shouldBeNull) {
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
         <Switch size="small" color="primary" onChange={handleMakeNullToggle} />
         {headding} ({unit}){" "}
         {helperTooltipText ? <HelpIcon tooltipText={helperTooltipText} /> : ""}
         {!shouldBeNull ? (
            <Grid container spacing={2} alignItems="center">
               <Grid item xs>
                  <Slider
                     value={value}
                     onChange={handleSliderChange}
                     aria-labelledby="input-slider"
                     max={max}
                     min={min}
                     marks={marks}
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
         ) : (
            <div style={{ marginBottom: "25px" }}></div>
         )}
      </div>
   );
}
