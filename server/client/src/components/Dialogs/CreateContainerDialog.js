import React, { useState } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import { InputSlider } from "components/Limits/Slider.js";
import { projectPost } from "actions/ProjectActions.js";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
} from "service/UnitsConvertor.js";

const CreateContainerDialog = ({ projectPost, userProjects, notify, open, setOpen }) => {
   const { projects, state } = userProjects;
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

   const handleClose = () => {
      setOpen(false);
   };

   const handleAdd = (event) => {
      if (errorMessage !== null) {
         return;
      }
      projectPost(project, notify);
      setOpen(false);
   };

   const handleNameType = (event) => {
      project.name = event.target.value;
      if (projects.map((item) => item.name).includes(project.name)) {
         setErrorMessage("There is already project with this name present.");
      } else if (project.name === "") {
         setErrorMessage("Must not be empty");
      } else if (project.name.length >= 30) {
         setErrorMessage("Name must be shorter than 30 characters");
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
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new container</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  error={errorMessage !== null}
                  margin="dense"
                  label="Container Name"
                  type="text"
                  fullWidth
                  onChange={handleNameType}
                  style={{ marginBottom: "10px" }}
                  helperText={errorMessage}
               />
               <div style={{width: "100%", marginLeft: "-12px"}}>
                  <Checkbox size="small" color="primary" onChange={() => {}} />
                  <span>Autostart</span>
               </div>
               <div style={{width: "100%", marginLeft: "-12px"}}>
                  <Checkbox size="small" color="primary" onChange={() => {}} />
                  <span>Stateful</span>
               </div>
               <div style={{width: "100%", marginLeft: "-12px", marginBottom: "5px"}}>
                  <Checkbox size="small" color="primary" onChange={() => {}} />
                  <span>Connect to the internet</span>
               </div>
               <InputSlider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     project.limits.RAM = value;
                  }}
                  min={0}
                  max={convertedRAM}
                  unit={"MB"}
               />
               <InputSlider
                  headding={"CPU"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.CPU = value;
                  }}
                  max={convertedCPU}
                  unit={"Hz"}
               />
               <InputSlider
                  headding={"Disk"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.disk = value;
                  }}
                  max={convertedDisk}
                  unit={"GB"}
               />
               <InputSlider
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     project.limits.network.download = value;
                  }}
                  max={convertedUpload}
                  unit={"Mbit/s"}
               />
               <InputSlider
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
      createInstanceConfigData: state.combinedUserData.createInstanceConfigData,
      userProjects: state.combinedUserData.userProjects,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      projectPost: (project, projectPostFailNotification) => {
         dispatch(projectPost(project, projectPostFailNotification));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateContainerDialog);
