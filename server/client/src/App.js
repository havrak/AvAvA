/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import UserLayout from "./layouts/User.js";
import UserSetup from "./components/UserSetup.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App(props) {
   return (
      <>
         <BrowserRouter>
            <Switch>
               <Route path="/user" component={UserLayout} />
               {/* <Redirect from="/" to="/user/dashboard" /> */}
               <Route path="/userSetup" exact={true}>
                  <UserSetup />
               </Route>
            </Switch>
         </BrowserRouter>
      </>
   );
}

export default App;
