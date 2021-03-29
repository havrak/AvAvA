import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { combinedDataGet } from "../actions/myaction";
import { Redirect } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

function UserSetup({ combinedDataGet, userData }) {
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      combinedDataGet();
   }, []);
   if (userData) {
      // return <Redirect to="/user/dashboard" />;
      // console.log(userData);
      return null;
   } else {
      return (
         <div id="pageLoader">
            <BeatLoader color={"#212529"} loading={true} size={50} />
         </div>
      );
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
