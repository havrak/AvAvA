import React, {useEffect} from "react";
import { combinedDataGet } from "../actions/myaction";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import {
   DiskCircularStateChartCard,
   CPUCircularStateChartCard,
   RAMCircularStateChartCard,
   DownloadCircularStateChartCard,
   UploadCircularStateChartCard,
} from "../components/chartCards/CircularStateChartCard.js";
import { connect } from "react-redux";

function Dashboard({ hostInformation, user, projects, state, combinedDataGet }) {
   useEffect(() => {
      combinedDataGet();
   }, []);
   if (!user) {
      return (
         <div id="pageLoader">
            <ClipLoader color={"#212529"} loading={true} size={50} />
         </div>
      );
   } else {
      const { RAM, CPU, disk, network, limits, numberOfProcesses } = state;
      let ownProjects = 0;
      let foreignProjects = 0;

      let runningContainers = 0;
      let stoppedContainers = 0;
      let frozenContainers = 0;
      // let ownContainers = 0;
      // let foreignContainers = 0;
      for (const project of projects) {
         // if(project.owner.id === user.id){
         if (project.owner.id === user.id) {
            //testing purposes
            ownProjects++;
            // ownContainers += project.containers.length;
         } else {
            foreignProjects++;
            // foreignContainers += project.containers.length;
         }
         for (const container of project.containers) {
            console.log(container);
            if (container.state.operationState.status === "Running") {
               runningContainers++;
            } else if (container.state.operationState.status === "Stopped") {
               stoppedContainers++;
            } else if (container.state.operationState.status === "Frozen") {
               frozenContainers++;
            }
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
                                                <div className="success-text">
                                                   you own
                                                </div>
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
                                    {/* <Col sm="12" md="4" lg="12" xl="4">
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
                                 </Col> */}
                                    <Col sm="12" md="4" lg="12" xl="4">
                                       <Card className="mb-0">
                                          <Card.Body className="p-1">
                                             <div className="card-state-container">
                                                <h2 className="running">
                                                   {runningContainers}
                                                </h2>
                                                <div className="success-text">
                                                   Running
                                                </div>
                                             </div>
                                          </Card.Body>
                                       </Card>
                                    </Col>
                                    <Col sm="12" md="4" lg="12" xl="4">
                                       <Card className="mb-0">
                                          <Card.Body className="p-1">
                                             <div className="card-state-container">
                                                <h2 className="stopped">
                                                   {stoppedContainers}
                                                </h2>
                                                <div className="success-text">
                                                   Stopped
                                                </div>
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
                                    </Col>
                                 </Row>
                              </Card.Body>
                           </Container>
                        </Card>
                     </Link>
                  </Col>
               </Row>
               <Row>
                  <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     <DiskCircularStateChartCard
                        usedAmount={disk.usage}
                        allocatedAmount={disk.allocated}
                        maxAmount={limits.disk}
                        percentConsumed={disk.percentConsumed}
                        percentAllocated={disk.percentAllocated}
                     />
                  </Col>
                  <Col sm="6" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     <CPUCircularStateChartCard
                        maxHz={limits.CPU}
                        usedTime={CPU.consumedTime}
                        consumedHz={CPU.consumedHz}
                        percentConsumed={CPU.percentConsumed}
                        allocatedHz={CPU.allocatedHz}
                        percentAllocated={CPU.percentAllocated}
                        cpuInfo={hostInformation.CPU}
                     />
                  </Col>
                  <Col sm="12" md="4" lg="4" xl="4" className="col-xxl-5-group">
                     <RAMCircularStateChartCard
                        usedAmount={RAM.usage}
                        allocatedAmount={RAM.allocated}
                        maxAmount={limits.RAM}
                        percentConsumed={RAM.percentConsumed}
                        percentAllocated={RAM.percentAllocated}
                     />
                  </Col>
                  <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                     <DownloadCircularStateChartCard
                        usedAmount={network.download.downloadSpeed}
                        allocatedAmount={network.download.allocatedDownloadSpeed}
                        maxAmount={limits.network.download}
                        percentConsumed={network.download.downloadBandwidthUsage}
                        percentAllocated={network.download.allocatedBandwidthUsage}
                     />
                  </Col>
                  <Col sm="6" md="6" lg="6" xl="6" className="col-xxl-5-group">
                     <UploadCircularStateChartCard
                        usedAmount={network.upload.uploadSpeed}
                        allocatedAmount={network.upload.allocatedUploadSpeed}
                        maxAmount={limits.network.upload}
                        percentConsumed={network.upload.uploadBandwidthUsage}
                        percentAllocated={network.upload.allocatedBandwidthUsage}
                     />
                  </Col>
                  <Col sm="12" md="4" lg="4" xl="4">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">{numberOfProcesses}</Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Container fluid>processes running</Container>
                        </Card.Body>
                     </Card>
                  </Col>
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
                  <Col sm="12" md="4" lg="4" xl="4">
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
                                    <span className="to-underline">
                                       Buy more resources
                                    </span>
                                 </Link>
                              </span>
                           </Container>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </Container>
         </>
      );
   }
}

const mapStateToProps = (state) => {
   return {
      hostInformation: state.combinedUserData.hostInformation,
      user: state.combinedUserData.user,
      projects: state.combinedUserData.userProjects.projects,
      state: state.combinedUserData.userProjects.userState,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      combinedDataGet: () => {
         dispatch(combinedDataGet());
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Dashboard);
