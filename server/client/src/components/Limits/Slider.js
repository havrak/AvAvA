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
      width: 42,
   },
});

export default function InputSlider({headding, min, max}) {
   const classes = useStyles();
   const [value, setValue] = React.useState(30);

   const handleSliderChange = (event, newValue) => {
      setValue(newValue);
   };

   const handleInputChange = (event) => {
      setValue(event.target.value === "" ? "" : Number(event.target.value));
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
      {headding}
         <Grid container spacing={2} alignItems="center">
            <Grid item xs>
               <Slider
                  value={typeof value === "number" ? value : 0}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  max={max}
                  min={min}
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
                     step: 100,
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
