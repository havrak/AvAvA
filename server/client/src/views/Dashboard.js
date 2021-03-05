import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import BeatLoader from "react-spinners/BeatLoader";
import { Link } from "react-router-dom";

function Dashboard() {
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
                                             <h2 className="">3</h2>
                                             <div className="success-text">you own</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="6" lg="12" xl="6">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2>1</h2>
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
                                             <h2 className="running">3000</h2>
                                             <div className="success-text">Running</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="stopped">20</h2>
                                             <div className="success-text">Stopped</div>
                                          </div>
                                       </Card.Body>
                                    </Card>
                                 </Col>
                                 <Col sm="12" md="4" lg="12" xl="4">
                                    <Card className="mb-0">
                                       <Card.Body className="p-1">
                                          <div className="card-state-container">
                                             <h2 className="freezed">1</h2>
                                             <div className="success-text">Freezed</div>
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
               <Col sm="6" md="6" lg="4">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">
                              <span style={{ marginRight: "14px" }}>
                                 <i class="fas fa-hdd"></i>
                              </span>
                              <span className="to-underline">Disk</span>
                              <div className="float-right">
                                 <div className="numbers">
                                    <Card.Title className="float-right" as="h4">
                                       8GB
                                    </Card.Title>
                                    <br />
                                    {/* <p className="card-category float-right">MAX</p> */}
                                 </div>
                              </div>
                           </Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Chart
                              chartType="PieChart"
                              loader={
                                 <BeatLoader color={"#212529"} loading={true} size={50} />
                              }
                              data={[
                                 ["Task", "Hours per Day"],
                                 ["used", 180],
                                 ["allocated", 32],
                                 ["free", 44],
                              ]}
                              options={{
                                 legend: "bottom",
                                 height: 300,
                                 chartArea: {
                                    width: "100%",
                                 },
                                 slices: {
                                    0: { color: "#FB404B" },
                                    1: { color: "#FFA534" },
                                    2: { color: "#1DC7EA" },
                                 },
                              }}
                              rootProps={{ "data-testid": "1" }}
                           />
                        </Card.Body>
                     </Card>
                  </Link>
               </Col>
               <Col sm="6" md="6" lg="4">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">
                              <span style={{ marginRight: "12px" }}>
                                 <i className="fas fa-microchip" />
                              </span>
                              <span className="to-underline">CPU</span>
                              <div className="float-right">
                                 <div className="numbers">
                                    <Card.Title className="float-right" as="h4">
                                       14% {/*  from */}
                                    </Card.Title>
                                    <br />
                                    {/* <p className="card-category float-right">1,2 GHz</p> */}
                                 </div>
                              </div>
                           </Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Chart
                              chartType="PieChart"
                              loader={
                                 <BeatLoader color={"#212529"} loading={true} size={50} />
                              }
                              data={[
                                 ["Task", "Hours per Day"],
                                 ["used", 180],
                                 ["allocated", 32],
                                 ["free", 44],
                              ]}
                              options={{
                                 legend: "bottom",
                                 height: 300,
                                 chartArea: {
                                    width: "100%",
                                 },
                                 slices: {
                                    0: { color: "#FB404B" },
                                    1: { color: "#FFA534" },
                                    2: { color: "#1DC7EA" },
                                 },
                              }}
                              rootProps={{ "data-testid": "1" }}
                           />
                        </Card.Body>
                     </Card>
                  </Link>
               </Col>
               <Col sm="6" md="6" lg="4">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">
                              <span style={{ marginRight: "14px" }}>
                                 <i className="fas fa-memory" />
                              </span>
                              <span className="to-underline">RAM</span>
                              <div className="float-right">
                                 <div className="numbers">
                                    <Card.Title className="float-right" as="h4">
                                       256MB
                                    </Card.Title>
                                    <br />
                                    {/* <p className="card-category float-right">MAX</p> */}
                                 </div>
                              </div>
                           </Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Chart
                              chartType="PieChart"
                              loader={
                                 <BeatLoader color={"#212529"} loading={true} size={50} />
                              }
                              data={[
                                 [
                                    "state",
                                    "MB",
                                    {
                                       role: "tooltip",
                                       type: "string",
                                       p: { html: true },
                                    },
                                 ],
                                 [
                                    "used",
                                    180,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>180MB<br/>70.3%</div>',
                                 ],
                                 [
                                    "allocated",
                                    32,
                                    '<div class="ggl-tooltip"><b>allocated</b><div></div>32MB<br/>12.5%</div>',
                                 ],
                                 [
                                    "free",
                                    44,
                                    '<div class="ggl-tooltip"><b>free</b><div></div>44MB<br/>17.2%</div>',
                                 ],
                              ]}
                              options={{
                                 legend: "bottom",
                                 height: 300,
                                 chartArea: {
                                    width: "100%",
                                 },
                                 slices: {
                                    0: { color: "#FB404B" },
                                    1: { color: "#FFA534" },
                                    2: { color: "#1DC7EA" },
                                 },
                                 tooltip: { isHtml: true, trigger: "visible" },
                              }}
                              rootProps={{ "data-testid": "1" }}
                           />
                        </Card.Body>
                     </Card>
                  </Link>
               </Col>
               <Col sm="6" md="6" lg="4">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">
                              <span style={{ marginRight: "14px" }}>
                                 <i class="fas fa-upload"></i>
                              </span>
                              <span className="to-underline">Upload</span>
                              <div className="float-right">
                                 <div className="numbers">
                                    <Card.Title className="float-right" as="h4">
                                       10MB/s
                                    </Card.Title>
                                    <br />
                                    {/* <p className="card-category float-right">MAX</p> */}
                                 </div>
                              </div>
                           </Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Chart
                              chartType="PieChart"
                              loader={
                                 <BeatLoader color={"#212529"} loading={true} size={50} />
                              }
                              data={[
                                 [
                                    "state",
                                    "MB",
                                    {
                                       role: "tooltip",
                                       type: "string",
                                       p: { html: true },
                                    },
                                 ],
                                 [
                                    "used",
                                    180,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>180MB<br/>70.3%</div>',
                                 ],
                                 [
                                    "allocated",
                                    32,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>32MB<br/>12.5%</div>',
                                 ],
                                 [
                                    "free",
                                    44,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>44MB<br/>17.2%</div>',
                                 ],
                              ]}
                              options={{
                                 legend: "bottom",
                                 height: 300,
                                 chartArea: {
                                    width: "100%",
                                 },
                                 slices: {
                                    0: { color: "#FB404B" },
                                    1: { color: "#FFA534" },
                                    2: { color: "#1DC7EA" },
                                 },
                                 tooltip: { isHtml: true, trigger: "visible" },
                              }}
                              rootProps={{ "data-testid": "1" }}
                           />
                        </Card.Body>
                     </Card>
                  </Link>
               </Col>
               <Col sm="6" md="6" lg="4">
                  <Link to="/user" className="card-link">
                     <Card className="card-dashboard">
                        <Card.Header>
                           <Card.Title as="h4">
                              <span style={{ marginRight: "14px" }}>
                                 <i class="fas fa-download"></i>
                              </span>
                              <span className="to-underline">Download</span>
                              <div className="float-right">
                                 <div className="numbers">
                                    <Card.Title className="float-right" as="h4">
                                       50MB/s
                                    </Card.Title>
                                    <br />
                                    {/* <p className="card-category float-right">MAX</p> */}
                                 </div>
                              </div>
                           </Card.Title>
                        </Card.Header>
                        <Card.Body className="p-0">
                           <Chart
                              chartType="PieChart"
                              loader={
                                 <BeatLoader color={"#212529"} loading={true} size={50} />
                              }
                              data={[
                                 [
                                    "state",
                                    "MB",
                                    {
                                       role: "tooltip",
                                       type: "string",
                                       p: { html: true },
                                    },
                                 ],
                                 [
                                    "used",
                                    180,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>180MB<br/>70.3%</div>',
                                 ],
                                 [
                                    "allocated",
                                    32,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>32MB<br/>12.5%</div>',
                                 ],
                                 [
                                    "free",
                                    44,
                                    '<div class="ggl-tooltip"><b>used</b><div></div>44MB<br/>17.2%</div>',
                                 ],
                              ]}
                              options={{
                                 legend: "bottom",
                                 height: 300,
                                 chartArea: {
                                    width: "100%",
                                 },
                                 slices: {
                                    0: { color: "#FB404B" },
                                    1: { color: "#FFA534" },
                                    2: { color: "#1DC7EA" },
                                 },
                                 tooltip: { isHtml: true, trigger: "visible" },
                              }}
                              rootProps={{ "data-testid": "1" }}
                           />
                        </Card.Body>
                     </Card>
                  </Link>
               </Col>
               <Col sm="6" md="6" lg="4">
                  <Card className="card-dashboard">
                     <Card.Header>
                        <Card.Title as="h4">
                           <span style={{ marginRight: "14px" }}>
                              <i class="fas fa-wallet" />
                           </span>
                           <span>Wallet</span>
                           <div className="float-right">
                              <div className="numbers">
                                 <Card.Title className="float-right" as="h4">
                                    256
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
               </Col>
            </Row>
         </Container>
      </>
   );
}

export default Dashboard;
