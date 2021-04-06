import React, { useEffect } from "react";
import { projectIdGet } from "actions/ProjectActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, Redirect } from "react-router-dom";
import {
   CPUCircularStateChartCard,
   RAMCircularStateChartCard,
   DiskCircularStateChartCard,
   UploadCircularStateChartCard,
   DownloadCircularStateChartCard,
} from "components/Cards/state/CurrentStateCards.js";
import { removePathParts, getCurrentProject } from "service/RoutesHelper";
import { ContainerCounter, ProjectCounter } from "components/Cards/Counters.js";
import { connect } from "react-redux";

function Info({
   currentProject,
   userState,
   limits,
   projectIdGet,
   setCustomizableBrandText,
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
   return (
      <>
         <Container fluid>
            <Row>
               <Col sm="12" md="12" lg="6" xl="6">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">Info</Card.Title>
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
                              {currentProject.coworkers.map((coworker, i) => {
                                 return (
                                    <span key={i}>
                                       {`${coworker.givenName} ${coworker.familyName}${
                                          i + 1 !== currentProject.coworkers.length ? "," : ""
                                       } `}{" "}
                                    </span>
                                 );
                              })}
                           </div>
                        </Container>
                     </Card.Body>
                  </Card>
               </Col>
               <Col lg="6" sm="12">
                  <Link
                     to={`/user/projects/${currentProject.id}/containers`}
                     className="card-link"
                  >
                     <ContainerCounter containers={userState.containers} />
                  </Link>
               </Col>
            </Row>
            <Row>
               <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <DiskCircularStateChartCard disk={userState.disk} max={limits.disk} />
               </Col>
               <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <CPUCircularStateChartCard CPU={userState.CPU} max={limits.CPU} />
               </Col>
               <Col sm="12" md="4" lg="4" xl="4" className="col-xxl-5-group">
                  <RAMCircularStateChartCard RAM={userState.RAM} max={limits.RAM} />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <DownloadCircularStateChartCard
                     download={userState.internet.download}
                     max={limits.internet.download}
                  />
               </Col>
               <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                  <UploadCircularStateChartCard
                     upload={userState.internet.upload}
                     max={limits.internet.upload}
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
   return {
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects),
      userState: state.combinedUserData.userProjects.state,
      limits: state.combinedUserData.userProjects.limits,
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
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Info);
