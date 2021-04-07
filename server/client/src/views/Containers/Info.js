import React, { useEffect } from "react";
import { containerIdGet } from "actions/ContainerActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import {
   CPUCircularStateChartCard,
   RAMCircularStateChartCard,
   DiskCircularStateChartCard,
   UploadCircularStateChartCard,
   DownloadCircularStateChartCard,
} from "components/Cards/state/CurrentStateCards.js";
import { removePathParts, getCurrentProjectAndContainer } from "service/RoutesHelper";
import { ContainerCounter } from "components/Cards/Counters.js";
import { connect } from "react-redux";

function Info({
   currentProject,
   currentContainer,
   containerIdGet,
   setCustomizableBrandText,
}) {
   const brand = [
      {
         text: "DVP",
         link: removePathParts(3),
         connectChar: "/",
      },
      {
         text: "Moodle",
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
   return (
      <>
         <Container fluid>
            <Row>
               <Col sm="12" md="12" lg="6" xl="6">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">Project Info</Card.Title>
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
                  <DiskCircularStateChartCard
                     disk={currentContainer.state.disk}
                     max={currentContainer.state.disk.limit}
                  />
               </Col>
               <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <CPUCircularStateChartCard
                     CPU={currentContainer.state.CPU}
                     max={currentContainer.state.CPU.limit}
                  />
               </Col>
               <Col sm="12" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <RAMCircularStateChartCard
                     RAM={currentContainer.state.RAM}
                     max={currentContainer.state.RAM.limit}
                  />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <DownloadCircularStateChartCard
                     download={currentContainer.state.internet.download}
                     max={currentContainer.state.internet.download.limit}
                  />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <UploadCircularStateChartCard
                     upload={currentContainer.state.internet.upload}
                     max={currentContainer.state.internet.upload.limit}
                  />
               </Col>
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
   const cp = getCurrentProjectAndContainer(state.combinedUserData.userProjects.projects);
   return {
      currentContainer: cp.currentProject,
      currentProject: cp.currentProject,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      containerIdGet: (projectId, containerId) => {
         dispatch(containerIdGet(projectId, containerId));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Info);
