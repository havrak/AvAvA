import React, { useEffect } from "react";
import { combinedDataGet } from "actions/UserActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import {
   CPUCircularStateChartCard,
   RAMCircularStateChartCard,
   DiskCircularStateChartCard,
   UploadCircularStateChartCard,
   DownloadCircularStateChartCard,
} from "components/Cards/state/CurrentStateCards.js";
import { ContainerCounter, ProjectCounter } from "components/Cards/Counters.js";
import { connect } from "react-redux";

function Dashboard({ user, state, limits, combinedDataGet, setCustomizableBrandText }) {
   const brand = [
      {
         text: "Dashboard",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   useEffect(() => {
      combinedDataGet();
   }, []);
   return (
      <>
         <Container fluid>
            <Row>
               
            </Row>
         </Container>
      </>
   );
}

const mapStateToProps = (state) => {
   return {
      user: state.combinedUserData.user,
      state: state.combinedUserData.userProjects.state,
      limits: state.combinedUserData.userProjects.limits,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      combinedDataGet: () => {
         dispatch(combinedDataGet());
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Dashboard);
