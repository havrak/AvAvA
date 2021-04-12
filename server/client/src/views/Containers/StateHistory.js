import React, { useEffect } from "react";
import { instancesIdStateWithHistoryGet } from "actions/ContainerActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { HistoryStateCard } from "components/Cards/HistoryState/HistoryStateChard";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { removePathParts, getCurrentProjectAndContainer } from "service/RoutesHelper";
import BeatLoader from "react-spinners/BeatLoader";

function StateHistory({ currentProject, currentContainer, setCustomizableBrandText, instancesIdStateWithHistoryGet, notify }) {
   if(!currentProject){
      return <Redirect to={removePathParts(2)} />;
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
         text: "History",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   useEffect(() => {
      instancesIdStateWithHistoryGet(currentProject.id, currentContainer.id, notify);
   }, []);
   if(currentContainer.stateHistory){
      return <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}><BeatLoader color={"#212529"} loading={true} size={50} /></div>
   }
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
      instancesIdStateWithHistoryGet: (projectId, containerId, notify) => {
         dispatch(instancesIdStateWithHistoryGet(projectId, containerId, notify));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(StateHistory);
