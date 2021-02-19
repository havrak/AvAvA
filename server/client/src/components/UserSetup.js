import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserAction } from "../actions/myaction";
import { Redirect } from "react-router-dom";
import { isConstructorDeclaration } from "typescript";
import axios from "axios";

function UserSetup({ fetchUser, user }) {
   useEffect(()=> {
      fetchUser();
   },[])
   if (user) {
      console.log("user:" + user.email);
      return <Redirect to="/user/dashboard" />;
   } else {
      return <div>Loading</div>;
   }
}

const mapStateToProps = (state) => {
   return {
      user: state.auth,
   };
};

const mapDispathToProps = (dispatch) => {
   return {
      fetchUser: () => {
         dispatch(fetchUserAction());
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(UserSetup);
