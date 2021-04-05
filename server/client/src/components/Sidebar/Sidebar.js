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
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "assets/img/LXD-icon.png";
import { isActive } from "service/RoutesHelper";
import { SidebarLink, SidebarLinkWithDropdown } from "./SidebarLink";
import { connect } from "react-redux";

function Sidebar({ color, routes, projects }) {
	const location = useLocation();
   return (
      <div className="sidebar" data-color={color}>
         <div className="sidebar-background" />
         <div className="sidebar-wrapper">
            <div className="logo d-flex align-items-center justify-content-start">
               <a href="/" className="simple-text logo-mini mx-1">
                  <div className="logo-img pr-2">
                     <img src={logo} alt="..." />
                  </div>
               </a>
               <a className="simple-text" href="/">
                  AvAvA
               </a>
            </div>
            <Nav>
               <SidebarLink
                  route={routes[0].layout + routes[0].path}
                  icon={routes[0].icon}
						name={routes[0].name}
						key="Dashboard"
               />
               <SidebarLinkWithDropdown
                  route={routes[1].layout + routes[1].path}
                  icon={routes[1].icon}
                  name={routes[1].name}
						key="Projects"
                  toCollapse={
                     projects
                        ? projects.map((project, key) => {
                             return (
                                <SidebarLinkWithDropdown
                                   route={`/user/projects/${project.id}`}
                                   name={project.name}
                                   level={2}
                                   key={`p${project.id}`}
                                   toCollapse={project.containers ? project.containers.map(
                                      (container, key2) => {
                                         return (
                                            <SidebarLink
                                               route={`/user/projects/${project.id}/containers/${container.id}`}
                                               name={container.name}
                                               key={`p${project.id}c${container.id}`}
                                            />
                                         );
                                      }
                                   ) : ""}
                                />
                             );
                          })
                        : ""
                  }
               />
               <SidebarLink
                  route={routes[routes.length - 1].layout + routes[routes.length - 1].path}
                  icon={routes[routes.length - 1].icon}
						name={routes[routes.length - 1].name}
						key="Profile"
               />
            </Nav>
         </div>
      </div>
   );
}

const mapStateToProps = (state) => {
   return {
      projects: state?.combinedUserData?.userProjects?.projects,
   };
};

export default connect(mapStateToProps)(Sidebar);
