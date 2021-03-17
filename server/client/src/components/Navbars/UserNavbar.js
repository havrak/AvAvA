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
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import UserCard from "./UserCard";

import routes from "routes.js";

function Header({ logout, user }) {
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
   let name;
   let sublinks;
   for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
         name = routes[i].name;
         sublinks = routes[i].sublinks;
      }
   }

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

               <Navbar.Brand
                  href="#home"
                  onClick={(e) => e.preventDefault()}
                  className="mr-3"
               >
                  {name}
               </Navbar.Brand>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
               <span className="navbar-toggler-bar burger-lines"></span>
               <span className="navbar-toggler-bar burger-lines"></span>
               <span className="navbar-toggler-bar burger-lines"></span>
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ml-auto" navbar>
                  {sublinks.map((item) => {
                     return (
                        <Nav.Item
                        style={{display: "flex", alignItems: "center"}}>
                           <Nav.Link
                              className="m-0 p-0 pl-3"
                              href="#"
                              onClick={(e) => e.preventDefault()}
                           >
                              <span className="no-icon">{item}</span>
                           </Nav.Link>
                        </Nav.Item>
                     );
                  })}
                  <UserCard Nav={Nav}></UserCard>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

export default Header;
