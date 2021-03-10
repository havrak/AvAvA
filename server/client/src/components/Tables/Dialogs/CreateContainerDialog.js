import React, { useState } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from '../../Limits/Slider';

const AddUserDialog = (props) => {
   const [user, setUser] = useState(initialUser);
   const { addUserHandler, createRecordHeadding } = props;
   const [open, setOpen] = React.useState(false);

   const [switchState, setSwitchState] = React.useState({
      addMultiple: false,
   });

   const handleSwitchChange = (name) => (event) => {
      setSwitchState({ ...switchState, [name]: event.target.checked });
   };

   const resetSwitch = () => {
      setSwitchState({ addMultiple: false });
   };

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
      resetSwitch();
   };

   const handleAdd = (event) => {
      addUserHandler(user);
      setUser(initialUser);
      switchState.addMultiple ? setOpen(true) : setOpen(false);
   };

   const handleChange = (name) => {
      return ({ target: { value } }) => {
         setUser({ ...user, [name]: value });
      };
   };

   return (
      <div>
         <Tooltip title="Add">
            <IconButton aria-label="add" onClick={handleClickOpen}>
               <AddIcon />
            </IconButton>
         </Tooltip>
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{createRecordHeadding}</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  margin="dense"
                  label="First Name"
                  type="text"
                  fullWidth
                  value={user.firstName}
                  onChange={handleChange("firstName")}
                  style={{marginBottom: "20px"}}
               />
               <Slider headding={"RAM"} min={0} max={280}/>
               <Slider headding={"CPU"} min={0} max={280}/>
               <Slider headding={"Disk"} min={0} max={280}/>
               <Slider headding={"Upload"} min={0} max={280}/>
               <Slider headding={"Download"} min={0} max={280}/>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleAdd} color="primary">
                  Add
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

AddUserDialog.propTypes = {
   addUserHandler: PropTypes.func.isRequired,
};

export default AddUserDialog;
