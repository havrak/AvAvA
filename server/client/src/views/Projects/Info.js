import React, { useEffect, useState } from "react";
import { projectIdGet, projectIdDelete } from "actions/ProjectActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, Redirect } from "react-router-dom";
import { DeleteClickableIcon } from "components/Icons/ClickableIcons.js";
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";
import {
   CPUCircularStateChartCard,
   RAMCircularStateChartCard,
   DiskCircularStateChartCard,
   UploadCircularStateChartCard,
   DownloadCircularStateChartCard,
} from "components/Cards/state/CurrentStateCards.js";
import {
   CPUCircularStateChartCardWithoutLimits,
   RAMCircularStateChartCardWithoutLimits,
   DiskCircularStateChartCardWithoutLimits,
   UploadCircularStateChartCardWithoutLimits,
   DownloadCircularStateChartCardWithoutLimits,
} from "components/Cards/state/CurrentProjectStateWithoutLimitsCards.js";
import { removePathParts, getCurrentProject } from "service/RoutesHelper";
import { ContainerCounter, ProjectCounter } from "components/Cards/Counters.js";
import { connect } from "react-redux";
import { isPending } from "service/StateCalculator";

function Info({
   currentProject,
   userState,
   userLimits,
   projectIdGet,
   projectIdDelete,
   setCustomizableBrandText,
   notify,
}) {
   if (!currentProject) {
      return <Redirect to={removePathParts(2)} />;
   }
   const brand = [
      {
         text: currentProject.name,
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   useEffect(() => {
      projectIdGet(currentProject.id);
   }, []);

   const [dialogOpen, setDialogOpen] = useState(false);

   const deleteContainersHandler = () => {
      setDialogOpen(true);
   };

   const proceedWithDeletionHandler = () => {
      projectIdDelete(currentProject.id, notify);
   };
   return (
      <>
         <Container fluid>
            <Row>
               <Col sm="12" md="12" lg="6" xl="6">
                  <Card className="card-dashboard action-card">
                     <Card.Header>
                        <Card.Title as="h4">Project Info</Card.Title>
                        {currentProject.pendingState ? (
                           <>
                              <ClipLoader color={"#212529"} loading={true} size={30} />
                           </>
                        ) : null}
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
                              <b>Name: </b>
                              {currentProject.name}
                           </div>
                           <div className="information-item">
                              <b>Created on: </b>
                              {currentProject.createdOn}
                           </div>
                           <div className="information-item">
                              <b>Owner: </b>
                              {`${currentProject.owner.givenName} ${currentProject.owner.familyName}`}
                           </div>
                           <div className="information-item">
                              <b>Coworkers: </b>
                              {currentProject?.coworkers?.map((coworker, i) => {
                                 return (
                                    <span key={i}>
                                       {`${coworker.givenName} ${coworker.familyName}${
                                          i + 1 !== currentProject.coworkers.length
                                             ? ","
                                             : ""
                                       } `}{" "}
                                    </span>
                                 );
                              })}
                           </div>
                           {currentProject.pendingState ? (
                              <div className="information-item">
                                 <b>Owner: </b>
                                 {currentProject.pendingState}
                              </div>
                           ) : null}
                        </Container>
                     </Card.Body>
                  </Card>
               </Col>
               <Col lg="6" sm="12">
                  <Link
                     to={`/user/projects/${currentProject.id}/containers`}
                     className="card-link"
                  >
                     <ContainerCounter containers={currentProject.state.containers} />
                  </Link>
               </Col>
            </Row>
            <Row>
               <>
                  <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     {currentProject?.limits?.disk ? (
                        <DiskCircularStateChartCard
                           disk={currentProject.state.disk}
                           max={currentProject.limits.disk}
                        />
                     ) : (
                        <DiskCircularStateChartCardWithoutLimits
                           parentDiskState={userState.disk}
                           diskState={currentProject.state.disk}
                           max={userLimits.disk}
                        />
                     )}
                  </Col>
                  <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     {currentProject?.limits?.CPU ? (
                        <CPUCircularStateChartCard
                           CPU={currentProject.state.CPU}
                           max={currentProject.limits.CPU}
                        />
                     ) : (
                        <CPUCircularStateChartCardWithoutLimits
                           parentCPUState={userState.CPU}
                           CPUState={currentProject.state.CPU}
                           max={userLimits.CPU}
                        />
                     )}
                  </Col>
                  <Col sm="12" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     {currentProject?.limits?.RAM ? (
                        <RAMCircularStateChartCard
                           RAM={currentProject.state.RAM}
                           max={currentProject.limits.RAM}
                        />
                     ) : (
                        <RAMCircularStateChartCardWithoutLimits
                           parentRAMState={userState.RAM}
                           RAMState={currentProject.state.RAM}
                           max={userLimits.RAM}
                        />
                     )}
                  </Col>
                  <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                     {currentProject?.limits?.internet.download ? (
                        <DownloadCircularStateChartCard
                           download={currentProject.state.internet.download}
                           max={currentProject.limits.internet.download}
                        />
                     ) : (
                        <DownloadCircularStateChartCardWithoutLimits
                           parentDownloadState={userState.internet.download}
                           downloadState={currentProject.state.internet.download}
                           max={userLimits.internet.download}
                        />
                     )}
                  </Col>
                  <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                     {currentProject?.limits?.internet.upload ? (
                        <UploadCircularStateChartCard
                           upload={currentProject.state.internet.upload}
                           max={currentProject.limits.internet.upload}
                        />
                     ) : (
                        <UploadCircularStateChartCardWithoutLimits
                           parentUploadState={userState.internet.upload}
                           uploadState={currentProject.state.internet.upload}
                           max={userLimits.internet.upload}
                        />
                     )}
                  </Col>
               </>
               {/* <Col sm="12" md="4" lg="4" xl="4">
                     <NumberOfProcessesCard numberOfProcesses={1}/>
                  </Col> */}
               <Col sm="12" md="4" lg="4" xl="4">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">History</Card.Title>
                     </Card.Header>
                     <Card.Body className="p-0">
                        <Container fluid>
                           <Link to="/user" className="card-link">
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
   return {
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects),
      userState: state.combinedUserData.userProjects.state,
      userLimits: state.combinedUserData.userProjects.limits,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      projectIdGet: (projectId) => {
         dispatch(projectIdGet(projectId));
      },
      projectIdDelete: (projectId) => {
         dispatch(projectIdDelete(projectId));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Info);
