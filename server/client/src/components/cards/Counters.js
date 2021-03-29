import { Card, Container, Row, Col } from "react-bootstrap";

export function ProjectCounter({projects}){
   const {own, foreign} = projects;
   return (
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
                           <h2 className="">{own}</h2>
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
                           <h2>{foreign}</h2>
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
   )
}

export function ContainerCounter({containers}) {
   const {running, stopped, frozen} = containers;
   return (
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
                              <h2 className="running">{containers.running}</h2>
                              <div className="success-text">Running</div>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col sm="12" md="4" lg="12" xl="4">
                     <Card className="mb-0">
                        <Card.Body className="p-1">
                           <div className="card-state-container">
                              <h2 className="stopped">{containers.stopped}</h2>
                              <div className="success-text">Stopped</div>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col sm="12" md="4" lg="12" xl="4">
                     <Card className="mb-0">
                        <Card.Body className="p-1">
                           <div className="card-state-container">
                              <h2 className="frozen">{containers.frozen}</h2>
                              <div className="success-text">Frozen</div>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </Card.Body>
         </Container>
      </Card>
   );
}
