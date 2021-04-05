import React, { useState } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { InputSlider } from "components/Form/Slider.js";
import CheckboxDiv from 'components/Form/CheckboxDiv.js';
import { projectPost } from "actions/ProjectActions.js";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
} from "service/UnitsConvertor.js";
import {getCurrentProject} from 'service/RoutesHelper';

const CreateContainerDialog = ({ projectPost, currentProject, userState, notify, open, setOpen }) => {
   const [errorMessage, setErrorMessage] = React.useState(null);
   const container = {
      name: "",
      connectToInternet: true,
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
      container.name = event.target.value;
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
   let convertedRAM;
   let convertedCPU;
   let convertedDisk;
   let convertedUpload;
   let convertedDownload;
   if(currentProject.limits){
      convertedRAM = ramToMB(currentProject.state.RAM.free);
      convertedCPU = CPUToMHz(currentProject.state.CPU.free);
      convertedDisk = diskToGB(currentProject.state.disk.free);
      convertedUpload = networkSpeedToMbits(currentProject.state.internet.upload.free);
      convertedDownload = networkSpeedToMbits(currentProject.state.internet.download.free);
   } else {
      convertedRAM = ramToMB(userState.RAM.free);
      convertedCPU = CPUToMHz(userState.CPU.free);
      convertedDisk = diskToGB(userState.disk.free);
      convertedUpload = networkSpeedToMbits(userState.internet.upload.free);
      convertedDownload = networkSpeedToMbits(userState.internet.download.free);
   }
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
               {/* <CheckboxDiv tooltipText={"Autostart means that "} inputText={"Autostart"} /> */}
               {/* <CheckboxDiv tooltipText={"Dunno what it is"} inputText={"Stateful"} /> */}
               <CheckboxDiv tooltipText={"Container will be accessible via this kind of adress: container.project.yourname.servername.cz"} inputText={"Connect to the internet"} />
               <InputSlider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     project.limits.RAM = value;
                  }}
                  min={0}
                  max={convertedRAM}
                  unit={"MB"}
                  helperTooltipText={"Guarantee"}
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
      userState: state.combinedUserData.userProjects.state,
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects)
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
