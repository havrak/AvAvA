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
} from "components/Cards/state/CurrentContainerStateCards.js";
import {
   DeleteClickableIcon,
   StartClickableIcon,
   StopClickableIcon,
   FreezeClickableIcon,
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
   if (!currentContainer) {
      return <Redirect to={removePathParts(3)} />;
   }
   const brand = [
      {
         text: currentProject.name,
         link: removePathParts(3),
         connectChar: "/",
      },
      {
         text: currentContainer.name,
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
      containerIdGet(currentProject.id, currentContainer.id);
   }, []);

   const [dialogOpen, setDialogOpen] = useState(false);

   const startContainersHandler = () => {
      if (currentContainer.state.operationState.status === "Stopped") {
         containerIdStart(currentProject.id, currentContainer.id, notify);
      } else if (container.state.operationState.status === "Frozen") {
         containerIdUnfreeze(currentProject.id, currentContainer.id, notify);
      }
   };

   const stopContainersHandler = () => {
      containerIdStop(currentProject.id, currentContainer.id, notify);
   };

   const freezeContainersHandler = () => {
      containerIdFreeze(currentProject.id, currentContainer.id, notify);
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
                              {currentContainer.createdOn}
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
                        {currentContainer.pendingState ? (
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
                                    f={"dashboard-action-icon"}
                                    handler={startContainersHandler}
                                    style={{ padding: "0px" }}
                                 />
                              ) : currentContainer.state.operationState.status ===
                                "Frozen" ? (
                                 <StopClickableIcon
                                    key={"StopClickableIcon"}
                                    handler={stopContainersHandler}
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
                                    className={currentContainer.pendingState ? null : currentContainer.state.operationState.status.toLowerCase()}
                                 >
                                    {currentContainer.pendingState ? currentContainer.pendingState : currentContainer.state.operationState.status}
                                 </span>
                              }
                           </div>
                           <div className="information-item">
                              <b>Last started on: </b>
                              {currentContainer.lastStartedOn}
                           </div>
                           <div className="information-item">
                              <b>Measured on: </b>
                              {currentContainer.state.measuredOn}
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
      containerIdDelete: (id, containerDeleteFailNotification) => {
         dispatch(containerIdDelete(id, containerDeleteFailNotification));
      },
      containerIdStart: (id, containerDeleteFailNotification) => {
         dispatch(containerIdStart(id, containerDeleteFailNotification));
      },
      containerIdStop: (id, containerDeleteFailNotification) => {
         dispatch(containerIdStop(id, containerDeleteFailNotification));
      },
      containerIdFreeze: (id, containerDeleteFailNotification) => {
         dispatch(containerIdFreeze(id, containerDeleteFailNotification));
      },
      containerIdUnfreeze: (id, containerDeleteFailNotification) => {
         dispatch(containerIdUnfreeze(id, containerDeleteFailNotification));
      },
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      containerIdGet: (projectId, containerId) => {
         dispatch(containerIdGet(projectId, containerId));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Info);
