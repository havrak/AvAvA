import React, { useState, useRef } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { InputSlider } from "components/Form/Slider.js";
import { CheckboxDiv, RadioDiv } from "components/Form/ControlDivs.js";
import { containerPost } from "actions/ContainerActions.js";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
   bytesToAdequateValue,
   ramFromMBToB,
   diskFromGBToB,
   CPUFromMHzToHz,
   networkSpeedFromMBitsToBits,
} from "service/UnitsConvertor.js";
import { getCurrentProject } from "service/RoutesHelper";
import { Collapse } from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import IconButton from "@material-ui/core/IconButton";
import { HelpIcon } from "components/Icons/ClickableIcons";

const CreateContainerDialog = ({
   containerPost,
   currentProject,
   userState,
   notify,
   open,
   setOpen,
   createInstanceConfigData,
   createdContainer,
}) => {
   const [errorMessage, setErrorMessage] = useState(null);
   const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
   const [selectedTemplate, setSelectedTemplate] = useState(
      createInstanceConfigData.templates[0]
   );

   const handleClose = () => {
      setOpen(false);
   };

   const handleAdd = (event) => {
      const isThereANameError = checkForContainerNameErrors();
      const isThereAPasswordError = checkForPasswordErrors();
      if (isThereANameError || isThereAPasswordError) {
         return;
      }
      createdContainer.current.limits.RAM = ramFromMBToB(
         createdContainer.current.limits.RAM
      );
      createdContainer.current.limits.CPU = CPUFromMHzToHz(
         createdContainer.current.limits.CPU
      );
      createdContainer.current.limits.disk = diskFromGBToB(
         createdContainer.current.limits.disk
      );
      createdContainer.current.limits.internet.download = networkSpeedFromMBitsToBits(
         createdContainer.current.limits.internet.download
      );
      createdContainer.current.limits.internet.upload = networkSpeedFromMBitsToBits(
         createdContainer.current.limits.internet.upload
      );
      containerPost(createdContainer.current, notify);
      setOpen(false);
   };

   const handleNameType = (event) => {
      createdContainer.current.name = event.target.value;
      checkForContainerNameErrors();
   };

   const checkForContainerNameErrors = () => {
      if (
         currentProject.containers
            .map((item) => item.name)
            .includes(createdContainer.current.name)
      ) {
         setErrorMessage("There is already project with this name present.");
         return true;
      } else if (!createdContainer.current.name || createdContainer.current.name === "") {
         setErrorMessage("Must not be empty");
         return true;
      } else if (createdContainer.current.name.length >= 30) {
         setErrorMessage("Name must be shorter than 30 characters");
         return true;
      } else if (errorMessage) {
         setErrorMessage(null);
         return true;
      }
      return false;
   };

   const handlePasswordType = (event) => {
      createdContainer.current.rootPassword = event.target.value;
      checkForPasswordErrors();
   };

   const checkForPasswordErrors = () => {
      if (
         !createdContainer.current.rootPassword ||
         createdContainer.current.rootPassword === ""
      ) {
         setPasswordErrorMessage("Must not be empty");
         return true;
      } else if (passwordErrorMessage) {
         setPasswordErrorMessage(null);
         return true;
      }
      return false;
   };

   const handleTemplateChange = (item) => {
      if (item.minDiskUsage > userState.disk.free) {
         notify(
            "Required disk space for this template is greater than your current free disk capacity"
         );
      } else {
         setSelectedTemplate(item);
         createdContainer.current.templateId = item.id;
      }
   };

   let convertedRAM;
   let convertedCPU;
   let convertedDisk;
   let convertedUpload;
   let convertedDownload;
   if (currentProject.limits) {
      convertedRAM = ramToMB(currentProject.state.RAM.free);
      convertedCPU = CPUToMHz(currentProject.state.CPU.free);
      convertedDisk = diskToGB(currentProject.state.disk.free);
      convertedUpload = networkSpeedToMbits(currentProject.state.internet.upload.free);
      convertedDownload = networkSpeedToMbits(
         currentProject.state.internet.download.free
      );
   } else {
      convertedRAM = ramToMB(userState.RAM.free);
      convertedCPU = CPUToMHz(userState.CPU.free);
      convertedDisk = diskToGB(userState.disk.free);
      convertedUpload = networkSpeedToMbits(userState.internet.upload.free);
      convertedDownload = networkSpeedToMbits(userState.internet.download.free);
   }
   const [showTemplates, setTemplatesShown] = useState(false);
   const [showApplicationsToInstall, setApplicationsToInstallShown] = useState(false);
   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={"dialog"}
         >
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
               <TextField
                  autoFocus
                  error={passwordErrorMessage !== null}
                  margin="dense"
                  label="Root password"
                  type="password"
                  fullWidth
                  onChange={handlePasswordType}
                  style={{ marginBottom: "10px" }}
                  helperText={passwordErrorMessage}
               />
               <div>
                  <span>Applications to install </span>
                  <HelpIcon tooltipText={"ff"} />
                  <IconButton
                     color="inherit"
                     aria-label="collapseButton"
                     onClick={(e) => {
                        setApplicationsToInstallShown(!showApplicationsToInstall);
                     }}
                  >
                     {showApplicationsToInstall ? (
                        <ArrowDropUpIcon />
                     ) : (
                        <ArrowDropDownIcon />
                     )}
                  </IconButton>
                  <Collapse
                     className={"dialog-collapse-div"}
                     in={showApplicationsToInstall}
                  >
                     <div>
                        {createInstanceConfigData.applicationsToInstall.map((app) => {
                           return (
                              <CheckboxDiv
                                 tooltipText={app.name}
                                 inputText={app.description}
                                 handler={(shouldAdd) => {
                                    if (shouldAdd) {
                                       createdContainer.current.applicationsToInstall.push(
                                          app.id
                                       );
                                    } else {
                                       for (
                                          let i = 0;
                                          i <
                                          createdContainer.current.applicationsToInstall
                                             .length;
                                          i++
                                       ) {
                                          if (
                                             createdContainer.current
                                                .applicationsToInstall[i] === app.id
                                          ) {
                                             createdContainer.current.applicationsToInstall.splice(
                                                i,
                                                1
                                             );
                                          }
                                       }
                                    }
                                 }}
                                 key={app.id}
                              />
                           );
                        })}
                     </div>
                  </Collapse>
               </div>
               <div>
                  <span>
                     Template - {selectedTemplate.name} <HelpIcon tooltipText={"ff"} />
                  </span>
                  <IconButton
                     // className="dropdown-toggler"
                     color="inherit"
                     aria-label="collapseButton"
                     onClick={(e) => {
                        setTemplatesShown(!showTemplates);
                     }}
                  >
                     {showTemplates ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </IconButton>
                  <Collapse className={"dialog-collapse-div"} in={showTemplates}>
                     <RadioGroup
                        aria-label="quiz"
                        name="quiz"
                        // value={value}
                        // onChange={handleRadioChange}
                     >
                        {createInstanceConfigData.templates.map((template) => {
                           return (
                              <RadioDiv
                                 checked={template.id === selectedTemplate.id}
                                 handleChange={(e) => {
                                    handleTemplateChange(template);
                                 }}
                                 tooltipText={template.description}
                                 inputText={`${
                                    template.name
                                 } - min disk (${bytesToAdequateValue(
                                    template.minDiskUsage
                                 ).getMessage()})`}
                                 key={template.id}
                              />
                           );
                        })}
                     </RadioGroup>
                  </Collapse>
               </div>
               <CheckboxDiv
                  tooltipText={
                     "Container will be accessible via this kind of adress: container.project.yourname.servername.cz"
                  }
                  inputText={"Connect to internet"}
                  handler={(value) => {
                     createdContainer.current.connectToInternet = value;
                     console.log(createdContainer.current);
                  }}
               />
               <InputSlider
                  headding={"RAM"}
                  setValueToParentElement={(value) => {
                     createdContainer.current.limits.RAM = value;
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
                     createdContainer.current.limits.CPU = value;
                  }}
                  max={convertedCPU}
                  unit={"Hz"}
               />
               <InputSlider
                  headding={"Disk"}
                  min={diskToGB(selectedTemplate.minDiskUsage)}
                  setValueToParentElement={(value) => {
                     createdContainer.current.limits.disk = value;
                  }}
                  max={convertedDisk}
                  unit={"GB"}
               />
               <InputSlider
                  headding={"Upload"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdContainer.current.limits.internet.download = value;
                  }}
                  max={convertedUpload}
                  unit={"Mbit/s"}
               />
               <InputSlider
                  headding={"Download"}
                  min={0}
                  setValueToParentElement={(value) => {
                     createdContainer.current.limits.internet.upload = value;
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
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects),
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      containerPost: (project, projectPostFailNotification) => {
         dispatch(containerPost(project, projectPostFailNotification));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateContainerDialog);
