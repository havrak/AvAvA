import React, { useEffect } from "react";
import { instancesIdStateWithHistoryGet } from "actions/ContainerActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { HistoryStateCard } from "components/Cards/HistoryState/HistoryStateChard";
import { connect } from "react-redux";
import { removePathParts, getCurrentProjectAndContainer } from "service/RoutesHelper";

function Dashboard({ currentProject, currentContainer, setCustomizableBrandText }) {
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
         text: "History",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   useEffect(() => {
      instancesIdStateWithHistoryGet();
   }, []);
   return (
      <>
         <Container fluid>
            <Row>
               <Col sm="12" md="12" lg="12" xl="6" xxl="12">
                  <HistoryStateCard></HistoryStateCard>
               </Col>
               <Col sm="12" md="12" lg="12" xl="6">
                  <HistoryStateCard></HistoryStateCard>
               </Col>
               <Col sm="12" md="12" lg="12" xl="6">
                  <HistoryStateCard></HistoryStateCard>
               </Col>
               <Col sm="12" md="12" lg="12" xl="6">
                  <HistoryStateCard></HistoryStateCard>
               </Col>
               <Col sm="12" md="12" lg="12" xl="6">
                  <HistoryStateCard></HistoryStateCard>
               </Col>
               <Col sm="12" md="12" lg="12" xl="6">
                  <HistoryStateCard></HistoryStateCard>
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
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      instancesIdStateWithHistoryGet: (projectId, containerId) => {
         dispatch(combinedDatainstancesIdStateWithHistoryGetGet(projectId, containerId));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Dashboard);
