import React, { useState, useEffect } from "react";
import { containerIdGet } from "actions/ContainerActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import {
   CPUCircularStateChartCardForContainer,
   RAMCircularStateChartCardForContainer,
   DiskCircularStateChartCardForContainer,
   UploadCircularStateChartCardForContainer,
   DownloadCircularStateChartCardForContainer,
   NumberOfProcessesCard,
} from "components/Cards/State/CurrentContainerStateCards.js";
import {
   DeleteClickableIcon,
   StartClickableIcon,
   StopClickableIcon,
   FreezeClickableIcon,
   UnfreezeClickableIcon,
} from "components/Icons/ClickableIcons.js";
import { removePathParts, getCurrentProjectAndContainer } from "service/RoutesHelper";
import { connect } from "react-redux";
import {
   containerIdDelete,
   containerIdStart,
   containerIdStop,
   containerIdFreeze,
   containerIdUnfreeze,
} from "actions/ContainerActions";
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";
import ClipLoader from "react-spinners/ClipLoader";
import { isPending } from "service/StateCalculator";

function Info({
   currentProject,
   currentContainer,
   containerIdGet,
   setCustomizableBrandText,
   notify,
   containerIdDelete,
   containerIdStart,
   containerIdStop,
   containerIdFreeze,
   containerIdUnfreeze,
}) {
   const brand = [
      {
         text: currentProject?.name,
         link: removePathParts(3),
         connectChar: "/",
      },
      {
         text: currentContainer?.name,
         connectChar: " - ",
      },
      {
         text: "Info",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   }, []);
   useEffect(() => {
      containerIdGet(currentProject?.id, currentContainer?.id, notify);
   }, []);

   const [dialogOpen, setDialogOpen] = useState(false);

   if (!currentContainer) {
      return <Redirect to={removePathParts(2)} />;
   }
   if (!currentProject) {
      return <Redirect to={removePathParts(4)} />;
   }

   const startContainersHandler = () => {
      containerIdStart(currentProject.id, currentContainer.id, notify);
   };

   const stopContainersHandler = () => {
      containerIdStop(currentProject.id, currentContainer.id, notify);
   };

   const freezeContainersHandler = () => {
      containerIdFreeze(currentProject.id, currentContainer.id, notify);
   };

   const unfreezeContainerHandler = () => {
      containerIdUnfreeze(currentProject.id, currentContainer.id, notify);
   };

   const deleteContainersHandler = () => {
      setDialogOpen(true);
   };

   const proceedWithDeletionHandler = () => {
      containerIdDelete(currentProject.id, currentContainer.id, notify);
   };
   return (
      <>
         <Container fluid>
            <Row>
               <Col sm="12" md="12" lg="6" xl="6">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">Container Info</Card.Title>
                     </Card.Header>
                     <Card.Body className="p-0">
                        <Container fluid className="information-container">
                           <div className="information-item">
                              <b>Name: </b>
                              {currentContainer.name}
                           </div>
                           <div className="information-item">
                              <b>URL: </b>
                              {currentContainer.url}
                           </div>
                           <div className="information-item">
                              <b>Created on: </b>
                              {new Date(currentContainer.createdOn).toLocaleString()}
                           </div>
                           <div className="information-item">
                              <b>Snapshots: </b>
                              {currentContainer?.snapshots?.length}
                           </div>
                        </Container>
                     </Card.Body>
                  </Card>
               </Col>

               <Col sm="12" md="12" lg="6" xl="6">
                  <Card className="card-dashboard action-card">
                     <Card.Header>
                        <Card.Title as="h4">State</Card.Title>
                        {currentContainer.pendingState ||
                        isPending(currentContainer.state.operationState.statusCode) ? (
                           <>
                              <ClipLoader color={"#212529"} loading={true} size={30} />
                           </>
                        ) : (
                           <>
                              {currentContainer.state.operationState.status ===
                              "Running" ? (
                                 <>
                                    <StopClickableIcon
                                       key={"StopClickableIcon"}
                                       handler={stopContainersHandler}
                                    />
                                    <FreezeClickableIcon
                                       key={"FreezeClickableIcon"}
                                       handler={freezeContainersHandler}
                                    />
                                 </>
                              ) : currentContainer.state.operationState.status ===
                                "Stopped" ? (
                                 <StartClickableIcon
                                    key={"StartClickableIcon"}
                                    handler={startContainersHandler}
                                 />
                              ) : currentContainer.state.operationState.status ===
                                "Frozen" ? (
                                 <UnfreezeClickableIcon
                                    key={"StartClickableIcon"}
                                    handler={unfreezeContainerHandler}
                                 />
                              ) : null}
                           </>
                        )}
                        <DeleteClickableIcon
                           key={"DeleteIconButton"}
                           handler={deleteContainersHandler}
                        />
                        <AreYouSureDialog
                           open={dialogOpen}
                           setOpen={setDialogOpen}
                           actionCallback={proceedWithDeletionHandler}
                           whatToDo={`Do you want to delete this container?`}
                        />
                     </Card.Header>
                     <Card.Body className="p-0">
                        <Container fluid className="information-container">
                           <div className="information-item">
                              <b>Status: </b>
                              {
                                 <span
                                    className={
                                       currentContainer.pendingState
                                          ? null
                                          : currentContainer.state.operationState.status.toLowerCase()
                                    }
                                 >
                                    {currentContainer.pendingState
                                       ? currentContainer.pendingState
                                       : currentContainer.state.operationState.status}
                                 </span>
                              }
                           </div>
                           <div className="information-item">
                              <b>Last started on: </b>
                              {new Date(currentContainer.lastStartedOn).toLocaleString()}
                           </div>
                           <div className="information-item">
                              <b>Measured on: </b>
                              {/* {currentContainer.state.measuredOn} */}
                              {new Date().toLocaleString()}
                           </div>
                        </Container>
                     </Card.Body>
                  </Card>
               </Col>
               {/* <Col lg="6" sm="12">
                  <Link
                     to={`/user/projects/${currentProject.id}/containers`}
                     className="card-link"
                  >
                     <ContainerCounter containers={userState.containers} />
                  </Link>
               </Col> */}
            </Row>
            <Row>
               <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <DiskCircularStateChartCardForContainer
                     disk={currentContainer.state.disk}
                     max={currentContainer.state.disk.limit}
                  />
               </Col>
               <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <CPUCircularStateChartCardForContainer
                     CPU={currentContainer.state.CPU}
                     max={currentContainer.state.CPU.limit}
                  />
               </Col>
               <Col sm="12" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <RAMCircularStateChartCardForContainer
                     RAM={currentContainer.state.RAM}
                     max={currentContainer.state.RAM.limit}
                  />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <DownloadCircularStateChartCardForContainer
                     download={currentContainer.state.internet.counters.download}
                     max={currentContainer.state.internet.limits.download}
                  />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <UploadCircularStateChartCardForContainer
                     upload={currentContainer.state.internet.counters.upload}
                     max={currentContainer.state.internet.limits.upload}
                  />
               </Col>
               <Col sm="12" md="4" lg="4" xl="4">
                  <NumberOfProcessesCard
                     numberOfProcesses={currentContainer.state.numberOfProcesses}
                  />
               </Col>
               <Col sm="12" md="4" lg="4" xl="4">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">History</Card.Title>
                     </Card.Header>
                     <Card.Body className="p-0">
                        <Container fluid>
                           <Link to="history" className="card-link">
                              <span className="to-underline">
                                 Click here to see state logs
                              </span>
                           </Link>
                        </Container>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>
      </>
   );
}

const mapStateToProps = (state) => {
   const cp = getCurrentProjectAndContainer(state.combinedUserData.userProjects.projects);
   return {
      currentContainer: cp?.currentContainer,
      currentProject: cp?.currentProject,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      containerIdDelete: (id, containerDeleteFailNotification, notify) => {
         dispatch(containerIdDelete(id, containerDeleteFailNotification, notify));
      },
      containerIdStart: (id, containerDeleteFailNotification, notify) => {
         dispatch(containerIdStart(id, containerDeleteFailNotification, notify));
      },
      containerIdStop: (id, containerDeleteFailNotification, notify) => {
         dispatch(containerIdStop(id, containerDeleteFailNotification, notify));
      },
      containerIdFreeze: (id, containerDeleteFailNotification, notify) => {
         dispatch(containerIdFreeze(id, containerDeleteFailNotification, notify));
      },
      containerIdUnfreeze: (id, containerDeleteFailNotification, notify) => {
         dispatch(containerIdUnfreeze(id, containerDeleteFailNotification, notify));
      },
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      containerIdGet: (projectId, containerId, notify) => {
         dispatch(containerIdGet(projectId, containerId, notify));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Info);
