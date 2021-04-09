import React from 'react';
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";

function PasswordTextFieldWithToggle({
   parentHandler,
   passwordErrorMessage,
}) {
   const [shouldBeNull, setShouldBeNull] = React.useState(true);

   const handleSliderChange = (event) => {
      parentHandler(event);
   };

   const handleMakeNullToggle = (event) => {
      setShouldBeNull(!shouldBeNull);
      if (!shouldBeNull) {
         parentHandler(null);
      } else {
         parentHandler(event);
      }
   };

   return (
      <div style={{marginBottom: "10px"}} >
         <Switch size="small" color="primary" onChange={handleMakeNullToggle} />
               <span>Root password</span>
         {!shouldBeNull ? (
            <TextField
               autoFocus
               error={passwordErrorMessage !== null}
               margin="dense"
               label="Root password"
               type="password"
               fullWidth
               onChange={handleSliderChange}
               style={{ marginBottom: "10px" }}
               helperText={passwordErrorMessage}
            />
         ) : null}
      </div>
   );
}

export default PasswordTextFieldWithToggle;
