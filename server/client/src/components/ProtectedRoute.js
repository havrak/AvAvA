import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getCurrentUser } from "api";
import { connect } from "react-redux";

const ProtectedRoute = ({ component: Comp, user, path, ...rest }) => {
   console.log(user);
   if (user) {
      // return <Route path="/user" component={Comp} />;
      return <Route path={path} component={Comp} {...rest}/>;
   } else {
      window.location.href = "/auth/google";
      return null;
   }
   return (
      <Route
         path={path}
         {...rest}
         render={(props) => {
            return user ? <Comp {...props} /> : <Redirect to="/auth/google" />;
         }}
      />
   );
};

const mapStateToProps = (state) => {
   return {
      user: state.auth,
   };
};

export default connect(mapStateToProps)(ProtectedRoute);
