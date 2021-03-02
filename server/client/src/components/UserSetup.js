import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { combinedDataGet } from "../actions/myaction";
import { Redirect } from "react-router-dom";
import { isConstructorDeclaration } from "typescript";
import axios from "axios";

function UserSetup({ combinedDataGet, userData }) {
   useEffect(()=> {
      combinedDataGet();
   },[])
   if (userData.user) {
      return <Redirect to="/user/dashboard" />;
   } else {
      return <div>Loading</div>;
   }
}

const mapStateToProps = (state) => {
   return {
      userData: state.combinedUserData,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      combinedDataGet: () => {
         dispatch(combinedDataGet());
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(UserSetup);
