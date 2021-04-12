import React, { useState } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { projectPost } from "actions/ProjectActions.js";

import { InputSliderWithSwitch } from "components/Form/Slider.js";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
   ramFromMBToB,
   diskFromGBToB,
   CPUFromMHzToHz,
   networkSpeedFromMBitsToBits,
} from "service/UnitsConvertor.js";
import { CheckboxDiv } from "components/Form/ControlDivs.js";

const CreateSnapshotDialog = ({
   projectPost,
   userProjects,
   notify,
   open,
   setOpen,
   createdSnapshot,
}) => {
   const { projects, state } = userProjects;
   const [errorMessage, setErrorMessage] = React.useState(null);

   const handleClose = () => {
      setOpen(false);
   };

   const handleAdd = (event) => {
      const isThereANameError = checkForProjectNameErrors();
      if (isThereANameError) {
         return;
      }
      if (createdSnapshot.current.limits.RAM) {
         createdSnapshot.current.limits.RAM = ramFromMBToB(
            createdSnapshot.current.limits.RAM
         );
      }
      if (createdSnapshot.current.limits.CPU) {
         createdSnapshot.current.limits.CPU = CPUFromMHzToHz(
            createdSnapshot.current.limits.CPU
         );
      }
      if (createdSnapshot.current.limits.disk) {
         createdSnapshot.current.limits.disk = diskFromGBToB(
            createdSnapshot.current.limits.disk
         );
      }
      if (createdSnapshot.current.limits.internet.download) {
         createdSnapshot.current.limits.internet.download = networkSpeedFromMBitsToBits(
            createdSnapshot.current.limits.internet.download
         );
      }
      if (createdSnapshot.current.limits.internet.upload) {
         createdSnapshot.current.limits.internet.upload = networkSpeedFromMBitsToBits(
            createdSnapshot.current.limits.internet.upload
         );
      }
      projectPost(createdSnapshot.current, notify);
      setOpen(false);
   };

   const handleNameType = (event) => {
      createdSnapshot.current.name = event.target.value;
      checkForProjectNameErrors();
   };

   const checkForProjectNameErrors = () => {
      if (projects.map((item) => item.name).includes(createdSnapshot.current.name)) {
         setErrorMessage("There is already project with this name present.");
         return true;
      } else if (createdSnapshot.current.name === "") {
         setErrorMessage("Must not be empty");
         return true;
      } else if (createdSnapshot.current.name.length >= 30) {
         setErrorMessage("Name must be shorter than 30 characters");
         return true;
      } else if (errorMessage) {
         setErrorMessage(null);
         return true;
      }
      return false;
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
                  label="Project Name"
                  type="text"
                  fullWidth
                  onChange={handleNameType}
                  // style={{ marginBottom: "20px" }}
                  helperText={errorMessage}
               />
               <CheckboxDiv
                  tooltipText={
                     "If container is stateful, then current state of the container is going to be reverted on revert"
                  }
                  inputText={"Stateful"}
                  handler={(value) => {
                     createdSnapshot.current.stateful = value;
                     console.log(createdSnapshot.current);
                  }}
               />
               <h3 className={"limits-headding"}>Limits</h3>
               <InputSliderWithSwitch
                  headding={"Disk"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdSnapshot.current.limits.disk = value;
                  }}
                  initialValue={createdSnapshot.current.limits.disk}
                  max={convertedDisk}
                  unit={"GB"}
               />
               <InputSliderWithSwitch
                  headding={"CPU"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdSnapshot.current.limits.CPU = value;
                  }}
                  initialValue={createdSnapshot.current.limits.CPU}
                  max={convertedCPU}
                  unit={"MHz"}
               />
               <InputSliderWithSwitch
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     createdSnapshot.current.limits.RAM = value;
                  }}
                  min={0}
                  initialValue={createdSnapshot.current.limits.RAM}
                  max={convertedRAM}
                  unit={"MB"}
                  helperTooltipText={"Guarantee"}
               />
               <InputSliderWithSwitch
                  headding={"Download"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdSnapshot.current.limits.internet.upload = value;
                  }}
                  initialValue={createdSnapshot.current.limits.internet.upload}
                  max={convertedDownload}
                  unit={"Mbit/s"}
               />
               <InputSliderWithSwitch
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdSnapshot.current.limits.internet.download = value;
                  }}
                  initialValue={createdSnapshot.current.limits.internet.download}
                  max={convertedUpload}
                  unit={"Mbit/s"}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleAdd} color="primary">
                  Create
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
      projectPost: (project, notify) => {
         dispatch(projectPost(project, notify));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSnapshotDialog);
