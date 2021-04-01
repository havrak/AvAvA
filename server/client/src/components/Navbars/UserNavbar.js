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
import React, { Component } from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import UserCard from "./UserCard";
import { relativeLocation, getValidRoute } from "service/RoutesHelper.js";
import { connect } from "react-redux";
import _ from "lodash";

function Header({ logout, user, brand }) {
   const location = useLocation();
   const mobileSidebarToggle = (e) => {
      e.preventDefault();
      document.documentElement.classList.toggle("nav-open");
      var node = document.createElement("div");
      node.id = "bodyClick";
      node.onclick = function () {
         this.parentElement.removeChild(this);
         document.documentElement.classList.toggle("nav-open");
      };
      document.body.appendChild(node);
   };
   let validRoute = _.cloneDeep(getValidRoute());
   let navLinks;
   if (validRoute !== -1) {
      navLinks = validRoute.navLinks;
      if (navLinks) {
         for (const navLink of navLinks) {
            navLink.link = relativeLocation(navLink.link);
         }
      }
   }

   console.log(brand);

   return (
      <Navbar bg="light" expand="lg">
         <Container fluid>
            <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
               <Button
                  variant="dark"
                  className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
                  onClick={mobileSidebarToggle}
               >
                  <i className="fas fa-ellipsis-v"></i>
               </Button>
               {brand.map((item) => {
                  if (item.link) {
                     return (
                        <>
                           <Link to={item.link}>
                              <span className="navbar-brand change-color-on-hover">
                                 {item.text}
                              </span>
                           </Link>
                           {item.connectChar ? (
                              <span className="navbar-brand connect-char">{item.connectChar}</span>
                           ) : (
                              ""
                           )}
                        </>
                     );
                  } else {
                     return (
                        <>
                           <span className="navbar-brand">{item.text}</span>
                           {item.connectChar ? (
                              <span className="navbar-brand connect-char">{item.connectChar}</span>
                           ) : (
                              ""
                           )}
                        </>
                     );
                  }
               })}
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
               <span className="navbar-toggler-bar burger-lines"></span>
               <span className="navbar-toggler-bar burger-lines"></span>
               <span className="navbar-toggler-bar burger-lines"></span>
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav navbar>
                  <div className="navbar-container">
                     {navLinks
                        ? navLinks.map((item) => {
                             return (
                                <Nav.Item className={"navbar-link"}>
                                   <Link className="m-0 p-0 pl-3" to={item.link}>
                                      <span className="no-icon">{item.name}</span>
                                   </Link>
                                </Nav.Item>
                             );
                          })
                        : ""}
                  </div>
                  {navLinks ? <div className="navbar-separator"></div> : ""}
                  <UserCard Nav={Nav}></UserCard>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

const mapStateToProps = (state) => {
   return { brand: state.frontend.brand };
};

export default connect(mapStateToProps, null)(Header);
