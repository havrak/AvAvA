import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import BeatLoader from "react-spinners/BeatLoader";
import { Link } from "react-router-dom";
import {
   CircularStateChartCard,
   CPUCircularStateChartCard,
} from "../components/chartCards/CircularStateChartCard.js";
import { connect } from "react-redux";

import {
   bytesToAdequateMessage,
   bytesPerSecondToAdequateMessage,
   secondsToAdequateMessage,
} from "../service/UnitsConvertor.js";

function Dashboard({ hostInformation, user, projects, state }) {
   const { RAM, CPU, disk, network, limits, numberOfProcesses } = state;
   let ownProjects = 0;
   let foreignProjects = 0;

   let runningContainers = 0;
   // let stoppedContainers = 0;
   // let frozenContainers = 0;
   let ownContainers = 0;
   let foreignContainers = 0;
   for (const project of projects) {
      // if(project.owner.id === user.id){
      if (project.owner === undefined) {
         //testing purposes
         ownProjects++;
         ownContainers += project.containers.length;
      } else {
         foreignProjects++;
         foreignContainers += project.containers.length;
      }
      for (const container of project.containers) {
         if (container.state.status === "Running") {
            runningContainers++;
         }
         //  else if (container.state.status === "Stopped") {
         //    stoppedContainers++;
         // } else if (container.state.status === "Frozen") {
         //    frozenContainers++;
         // }
      }
   }
   return (
      <>
         <Container fluid>
            <Row>
               <Col lg="6" sm="12">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Container fluid>
                           <Card.Header>
                              <Card.Title as="h4">
                                 <span className="to-underline">Projects</span>
                              </Card.Title>
                           </Card.Header>
                           <Card.Body>
                              <Row>
                                 <Col sm="12" md="6" lg="12" xl="6">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="">{ownProjects}</h2>
                                             <div className="success-text">you own</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="6" lg="12" xl="6">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2>{foreignProjects}</h2>
                                             <div className="success-text">
                                                you participate in
                                             </div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                              </Row>
                           </Card.Body>
                           {/* <Card.Footer>
                           <hr></hr>
                           <div className="stats">
                              <i className="fas fa-redo mr-1"></i>
                              Update now
                           </div>
                        </Card.Footer> */}
                        </Container>
                     </Card>
                  </Link>
               </Col>
               <Col lg="6" sm="12">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Container fluid>
                           <Card.Header>
                              <Card.Title as="h4">
                                 <span className="to-underline">Containers</span>
                              </Card.Title>
                           </Card.Header>
                           <Card.Body>
                              <Row>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2>{ownContainers}</h2>
                                             <div className="success-text">you own</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2>{foreignContainers}</h2>
                                             <div
                                                className="success-text"
                                                style={{ textAlign: "center" }}
                                             >
                                                you have access to
                                             </div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="running">
                                                {runningContainers}
                                             </h2>
                                             <div className="success-text">Running</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 {/* <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="stopped">
                                                {stoppedContainers}
                                             </h2>
                                             <div className="success-text">Stopped</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="frozen">
                                                {frozenContainers}
                                             </h2>
                                             <div className="success-text">Frozen</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col> */}
                              </Row>
                           </Card.Body>
                        </Container>
                     </Card>
                  </Link>
               </Col>
            </Row>
            <Row>
               <Col sm="6" md="6" lg="4" xl="3">
                  <CircularStateChartCard
                     usedAmount={disk.usage}
                     allocatedAmount={disk.allocated}
                     maxAmount={limits.disk}
                     percentConsumed={disk.percentConsumed}
                     percentAllocated={disk.percentAllocated}
                     stateName={"Disk"}
                     convertorCallback={bytesToAdequateMessage}
                     baseUnit={"B"}
                  />
               </Col>
               <Col sm="6" md="6" lg="4" xl="3">
                  <CPUCircularStateChartCard
                     usedTime={CPU.consumedTime}
                     percentConsumed={CPU.percentConsumed}
                     percentAllocated={CPU.percentAllocated}
                     cpuInfo={hostInformation.CPU}
                  />
               </Col>
               <Col sm="6" md="6" lg="4" xl="3">
                  <CircularStateChartCard
                     usedAmount={RAM.usage}
                     allocatedAmount={RAM.allocated}
                     maxAmount={limits.RAM}
                     percentConsumed={RAM.percentConsumed}
                     percentAllocated={RAM.percentAllocated}
                     stateName={"RAM"}
                     convertorCallback={bytesToAdequateMessage}
                     baseUnit={"B"}
                  />
               </Col>
               <Col sm="6" md="6" lg="4" xl="3">
                  <CircularStateChartCard
                     usedAmount={network.download.downloadSpeed}
                     allocatedAmount={network.download.allocatedDownloadSpeed}
                     maxAmount={limits.network.download}
                     percentConsumed={network.download.downloadBandwidthUsage}
                     percentAllocated={network.download.allocatedBandwidthUsage}
                     stateName={"Download"}
                     convertorCallback={bytesPerSecondToAdequateMessage}
                     baseUnit={"B/s"}
                  />
               </Col>
               <Col sm="6" md="6" lg="4" xl="3">
                  <CircularStateChartCard
                     usedAmount={network.upload.uploadSpeed}
                     allocatedAmount={network.upload.allocatedUploadSpeed}
                     maxAmount={limits.network.upload}
                     percentConsumed={network.upload.uploadBandwidthUsage}
                     percentAllocated={network.upload.allocatedBandwidthUsage}
                     stateName={"Upload"}
                     convertorCallback={bytesPerSecondToAdequateMessage}
                     baseUnit={"B/s"}
                  />
               </Col>
               <Col sm="6" md="6" lg="4" xl="3">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">
                           <span style={{ marginRight: "14px" }}>
                              <i className="fas fa-wallet" />
                           </span>
                           <span>Wallet</span>
                           <div className="float-right">
                              <div className="numbers">
                                 <Card.Title className="float-right" as="h4">
                                    {user.coins}
                                    <i className="fas fa-money-bill-alt ml-1 mr-1" />
                                 </Card.Title>
                                 <br />
                              </div>
                           </div>
                        </Card.Title>
                     </Card.Header>
                     <Card.Body className="p-0">
                        <Container fluid>
                           <span className="to-underline">
                              <Link to="/user" className="card-link">
                                 <span className="to-underline">Top up credit</span>
                              </Link>
                              <br />
                              <Link to="/user" className="card-link">
                                 <span className="to-underline">Buy more resources</span>
                              </Link>
                           </span>
                        </Container>
                     </Card.Body>
                  </Card>
                  <Card className="mb-0">
                     <Card.Body className="p-1">
                        <div className="card-state-container">
                           <h3 className="mt-2">{numberOfProcesses}</h3>
                           <div className="success-text">Running processes</div>
                        </div>
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
      hostInformation: state.combinedUserData.hostInformation,
      user: state.combinedUserData.user,
      projects: state.combinedUserData.userProjects.projects,
      state: state.combinedUserData.userProjects.userState,
   };
};

export default connect(mapStateToProps)(Dashboard);
