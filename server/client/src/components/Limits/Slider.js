import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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

export default function InputSlider({headding, setValueToParentElement, min, max, unit, step}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(min);

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
      setValueToParentElement(newValue);
   };

   const handleInputChange = (event) => {
      if(event.target.value === ""){
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
                  step={step}
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
