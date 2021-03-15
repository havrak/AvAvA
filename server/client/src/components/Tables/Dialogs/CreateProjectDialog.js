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
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from "../../Limits/Slider";

const CreateProjectDialog = ({ createHandler, userLimits, data}) => {
   const [open, setOpen] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState(null);
   const project = {
      name: "",
      owner: {},
      limits: {
         RAM: 0,
         CPU: 0,
         disk: 0,
         network: {
            upload: 0,
            download: 0,
         },
      },
   };
   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleAdd = (event) => {
      if(errorMessage !== null){
         return;
      }
      createHandler(project);
      setOpen(false);
   };

   const handleNameType = (event) => {
      project.name = event.target.value;
      if (data.map((item) => item.name).includes(project.name)) {
         setErrorMessage("There is already project with this name present.");
      } else if (project.name === "") {
         setErrorMessage("Must not be empty");
      } else if (errorMessage) {
         setErrorMessage(null);
      }
   };

   return (
      <div>
         <Tooltip title="Add">
            <IconButton aria-label="add" onClick={handleClickOpen}>
               <AddIcon />
            </IconButton>
         </Tooltip>
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new project</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  error={errorMessage !== null}
                  margin="dense"
                  label="Project Name"
                  type="text"
                  fullWidth
                  onChange={handleNameType}
                  style={{ marginBottom: "20px" }}
                  helperText={errorMessage}
               />
               <Slider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     project.limits.RAM = value;
                  }}
                  min={0}
                  max={userLimits.RAM}
                  unit={"MB"}
                  step={1}
               />
               <Slider
                  headding={"CPU"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.CPU = value;
                  }}
                  max={userLimits.CPU}
                  unit={`MHz`}
                  step={1}
               />
               <Slider
                  headding={"Disk"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.disk = value;
                  }}
                  max={userLimits.disk}
                  unit={"GB"}
                  step={0.01}
               />
               <Slider
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.network.download = value;
                  }}
                  max={userLimits.network.download}
                  unit={"Mb/s"}
                  step={0.01}
               />
               <Slider
                  headding={"Download"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.network.upload = value;
                  }}
                  max={userLimits.network.upload}
                  unit={"Mb/s"}
                  step={0.01}
               />
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

CreateProjectDialog.propTypes = {
   createHandler: PropTypes.func.isRequired,
};

export default CreateProjectDialog;
