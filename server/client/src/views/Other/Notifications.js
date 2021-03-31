import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import {
   Alert,
   Badge,
   Button,
   Card,
   Modal,
   Navbar,
   Nav,
   Container,
   Row,
   Col,
} from "react-bootstrap";

function Notifications() {
   const notificationAlertRef = React.useRef(null);
   const notify = (place, message, type) => {
      options = {
         place,
         message,
         type,
         autoDismiss: 6,
      };
      notificationAlertRef.current.notificationAlert(options);
   };
   return (
      <>
         {/* <div className="rna-"> */}
         <NotificationAlert ref={notificationAlertRef} />
         {/* </div> */}
         <Container fluid>
            <Card>
               <Card.Body>
                  <div className="places-buttons">
                     <Row className="justify-content-center">
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("tl")} variant="default">
                              Top Left
                           </Button>
                        </Col>
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("tc")} variant="default">
                              Top Center
                           </Button>
                        </Col>
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("tr")} variant="default">
                              Top Right
                           </Button>
                        </Col>
                     </Row>
                     <Row className="justify-content-center">
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("bl")} variant="default">
                              Bottom Left
                           </Button>
                        </Col>
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("bc")} variant="default">
                              Bottom Center
                           </Button>
                        </Col>
                        <Col lg="3" md="3">
                           <Button block onClick={() => notify("br")} variant="default">
                              Bottom Right
                           </Button>
                        </Col>
                     </Row>
                  </div>
               </Card.Body>
            </Card>
         </Container>
      </>
   );
}

export default Notifications;
