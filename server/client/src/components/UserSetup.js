import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { combinedDataGet } from "actions/UserActions";
import { Redirect } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
// import * as UserApi from "api/index";

// const api = new UserApi.DefaultApi();
function UserSetup({ combinedDataGet, userData }) {
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      combinedDataGet();
      // const callback = function (error, data, response) {
      //    if (error) {
      //       notify(`Error occured: ${response.body.message}`);
      //    } else {
      //       console.log(data);
      //    }
      // };
      // api.userGet(callback);
   }, []);
   if (userData?.user) {
      console.log(userData, 'user loaded loading');
      // return <Redirect to="/user/dashboard" />;
      // console.log(userData);
      // return null;
   } else {
      console.log(userData, 'user setup loading');
      return (
         <div class="pageLoader">
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
