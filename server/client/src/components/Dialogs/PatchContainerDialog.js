import React, { useState, useRef } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { InputSlider } from "components/Form/Slider.js";
import { containerIdPatch } from "actions/ContainerActions.js";
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
import PasswordTextFieldWithToggle from "components/Form/PasswordTextFieldWithToggle";

const PatchContainerDialog = ({
   containerIdPatch,
   currentProject,
   currentContainer,
   userState,
   notify,
   open,
   setOpen,
   patchedContainer,
}) => {
   const [errorMessage, setErrorMessage] = useState(null);
   const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);

   const handleClose = () => {
      setOpen(false);
   };

   const handleUpdate = (event) => {
      const isThereANameError = checkForContainerNameErrors();
      const isThereAPasswordError = checkForPasswordErrors();
      if (isThereANameError || (patchedContainer.current.rootPassword !== null ? true : false && isThereAPasswordError)) {
         return;
      }
      patchedContainer.current.limits.RAM = ramFromMBToB(
         patchedContainer.current.limits.RAM
      );
      patchedContainer.current.limits.CPU = CPUFromMHzToHz(
         patchedContainer.current.limits.CPU
      );
      patchedContainer.current.limits.disk = diskFromGBToB(
         patchedContainer.current.limits.disk
      );
      patchedContainer.current.limits.internet.download = networkSpeedFromMBitsToBits(
         patchedContainer.current.limits.internet.download
      );
      patchedContainer.current.limits.internet.upload = networkSpeedFromMBitsToBits(
         patchedContainer.current.limits.internet.upload
      );
      containerIdPatch(currentProject.id, patchedContainer.current, notify);
      setOpen(false);
   };

   const handleNameType = (event) => {
      patchedContainer.current.name = event.target.value;
      checkForContainerNameErrors();
   };

   const checkForContainerNameErrors = () => {
      if (
         currentContainer.name !== patchedContainer.current.name && currentProject.containers
            .map((item) => item.name)
            .includes(patchedContainer.current.name)
      ) {
         console.log('fff')
         setErrorMessage("There is already project with this name present.");
         return true;
      } else if (!patchedContainer.current.name || patchedContainer.current.name === "") {
         setErrorMessage("Must not be empty");
         return true;
      } else if (patchedContainer.current.name.length >= 30) {
         setErrorMessage("Name must be shorter than 30 characters");
         return true;
      } else if (errorMessage) {
         setErrorMessage(null);
         return true;
      }
      return false;
   };

   const handlePasswordType = (event) => {
      if(event){
         patchedContainer.current.rootPassword = event.target.value;
      } else {
         patchedContainer.current.rootPassword = null;
      }
      checkForPasswordErrors();
   };

   const checkForPasswordErrors = () => {
      if (
         !patchedContainer.current.rootPassword ||
         patchedContainer.current.rootPassword === ""
      ) {
         setPasswordErrorMessage("Must not be empty");
         return true;
      } else if (passwordErrorMessage) {
         setPasswordErrorMessage(null);
         return true;
      }
      return false;
   };

   let convertedRAM;
   let convertedCPU;
   let convertedDisk;
   let convertedUpload;
   let convertedDownload;
   if (currentProject.limits) {
      convertedRAM = ramToMB(
         currentProject.state.RAM.free + currentContainer.state.RAM.limit
      );
      convertedCPU = CPUToMHz(
         currentProject.state.CPU.free + currentContainer.state.CPU.limit
      );
      convertedDisk = diskToGB(
         currentProject.state.disk.free + currentContainer.state.disk.limit
      );
      convertedUpload = networkSpeedToMbits(
         currentProject.state.internet.upload.free +
            currentContainer.state.internet.limits.upload
      );
      convertedDownload = networkSpeedToMbits(
         currentProject.state.internet.download.free +
            currentContainer.state.internet.limits.download
      );
   } else {
      convertedRAM = ramToMB(userState.RAM.free + currentContainer.state.RAM.limit);
      convertedCPU = CPUToMHz(userState.CPU.free + currentContainer.state.CPU.limit);
      convertedDisk = diskToGB(userState.disk.free + currentContainer.state.disk.limit);
      convertedUpload = networkSpeedToMbits(
         userState.internet.upload.free + currentContainer.state.internet.limits.upload
      );
      convertedDownload = networkSpeedToMbits(
         userState.internet.download.free +
            currentContainer.state.internet.limits.download
      );
   }
   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={"dialog"}
         >
            <DialogTitle id="form-dialog-title">Settings</DialogTitle>
            <DialogContent>
               <TextField
                  autoFocus
                  error={errorMessage !== null}
                  margin="dense"
                  label="Container Name"
                  type="text"
                  fullWidth
                  onChange={handleNameType}
                  defaultValue={currentContainer.name}
                  style={{ marginBottom: "20px" }}
                  helperText={errorMessage}
               />
               <PasswordTextFieldWithToggle passwordErrorMessage={passwordErrorMessage} parentHandler={handlePasswordType} />
               {/* <CheckboxDiv
                  tooltipText={
                     "Container will be accessible via this kind of adress: container.project.yourname.servername.cz"
                  }
                  inputText={"Connect to internet"}
                  handler={(value) => {
                     patchedContainer.current.connectToInternet = value;
                     console.log(patchedContainer.current);
                  }}
               /> */}
               <InputSlider
                  headding={"Disk"}
                  min={diskToGB(currentContainer.state.disk.usage)}
                  setValueToParentElement={(value) => {
                     patchedContainer.current.limits.disk = value;
                  }}
                  initialValue={diskToGB(currentContainer.state.disk.limit)}
                  max={convertedDisk}
                  unit={"GB"}
               />
               <InputSlider
                  headding={"CPU"}
                  min={0}
                  setValueToParentElement={(value) => {
                     patchedContainer.current.limits.CPU = value;
                  }}
                  initialValue={CPUToMHz(currentContainer.state.CPU.limit)}
                  max={convertedCPU}
                  unit={"MHz"}
               />
               <InputSlider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     patchedContainer.current.limits.RAM = value;
                  }}
                  min={0}
                  max={convertedRAM}
                  initialValue={ramToMB(currentContainer.state.RAM.limit)}
                  unit={"MB"}
                  helperTooltipText={"Guarantee"}
               />
               <InputSlider
                  headding={"Download"}
                  min={0}
                  setValueToParentElement={(value) => {
                     patchedContainer.current.limits.internet.upload = value;
                  }}
                  initialValue={networkSpeedToMbits(currentContainer.state.internet.limits.download)}
                  max={convertedDownload}
                  unit={"Mbit/s"}
               />
               <InputSlider
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     patchedContainer.current.limits.internet.download = value;
                  }}
                  initialValue={networkSpeedToMbits(currentContainer.state.internet.limits.upload)}
                  max={convertedUpload}
                  unit={"Mbit/s"}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={handleUpdate} color="primary">
                  Update
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

const mapStateToProps = (state) => {
   return {
      userState: state.combinedUserData.userProjects.state,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      containerIdPatch: (projectId, containerPatched, notify) => {
         dispatch(containerIdPatch(projectId, containerPatched, notify));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(PatchContainerDialog);
