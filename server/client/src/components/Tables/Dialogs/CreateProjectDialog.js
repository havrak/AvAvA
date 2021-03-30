import React, { useState } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";

import Slider from "components/Limits/Slider.js";
import { startSpinnerProjectPost, projectPost } from "actions/myaction.js";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
} from "service/UnitsConvertor.js";

const CreateProjectDialog = ({ projectPost, startSpinnerProjectPost, userProjects, notify }) => {
   const {projects, state} = userProjects;
   const [open, setOpen] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState(null);
   const project = {
      name: "",
      owner: {},
      limits: {
         RAM: null,
         CPU: null,
         disk: null,
         network: {
            upload: null,
            download: null,
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
      if (errorMessage !== null) {
         return;
      }
      startSpinnerProjectPost(project);
      projectPost(project, projectPostFailNotification);
      setOpen(false);
   };

   const projectPostFailNotification = (name) => {
      notify(`project "${name}" could not be created`, "danger", 4);
   };

   const handleNameType = (event) => {
      project.name = event.target.value;
      if (projects.map((item) => item.name).includes(project.name)) {
         setErrorMessage("There is already project with this name present.");
      } else if (project.name === "") {
         setErrorMessage("Must not be empty");
      } else if (errorMessage) {
         setErrorMessage(null);
      }
   };

   const convertedRAM = ramToMB(state.RAM.free);
   const convertedCPU = CPUToMHz(state.CPU.free);
   const convertedDisk = diskToGB(state.disk.free);
   const convertedUpload = networkSpeedToMbits(state.internet.upload.free);
   const convertedDownload = networkSpeedToMbits(state.internet.download.free);

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
               <h3 className={"limits-headding"}>Limits</h3>
               <Slider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     project.limits.RAM = value;
                  }}
                  min={0}
                  max={convertedRAM}
                  unit={"MB"}
               />
               <Slider
                  headding={"CPU"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.CPU = value;
                  }}
                  max={convertedCPU}
                  unit={"Hz"}
               />
               <Slider
                  headding={"Disk"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.disk = value;
                  }}
                  max={convertedDisk}
                  unit={"GB"}
               />
               <Slider
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.network.download = value;
                  }}
                  max={convertedUpload}
                  unit={"Mbit/s"}
               />
               <Slider
                  headding={"Download"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.network.upload = value;
                  }}
                  max={convertedDownload}
                  unit={"Mbit/s"}
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

const mapStateToProps = (state) => {
   return {
      userProjects: state.combinedUserData.userProjects,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      projectPost: (project, projectPostFailNotification) => {
         dispatch(projectPost(project, projectPostFailNotification));
      },
      startSpinnerProjectPost: (project) => {
         dispatch(startSpinnerProjectPost(project));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectDialog);
