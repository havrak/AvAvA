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
import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "views/User/Dashboard.js";
import UserProfile from "views/User/UserProfile.js";
import Projects from "views/User/Projects.js";
import Project from "views/Projects/Project.js";
import ProjectContainers from "views/Projects/Containers.js";
import ProjectInfo from "views/Projects/Info.js";
import Container from "views/Containers/Container.js";
import ContainerInfo from "views/Containers/Info.js";
import ContainerConsole from "views/Containers/Console.js";
import ContainerSnapshots from "views/Containers/Snapshots.js";
// import Upgrade from "views/Upgrade.js";
import PatchContainer from "components/RouteComponents/PatchContainer";
import PatchProject from "components/RouteComponents/PatchProject";
import ContainerHistoryState from "views/Containers/StateHistory";
// import DownloadBackup from "components/RouteComponents/DownloadBackup";
import ContainerBackup from 'views/Containers/Backup';

const projectsNavLinks = [
   {
      name: "Info",
      link: "info",
      component: (name, link) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
      },
   },
   {
      name: "Containers",
      link: "containers",
      component: (name, link) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
      },
   },
   {
      name: "Settings",
      link: "settings",
      component: (name, link, notify) => {
         return <PatchProject name={name} link={link} notify={notify} />;
      },
   },
];

const containerNavLinks = [
   {
      name: "Info",
      link: "info",
      component: (name, link) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
      },
   },
   {
      name: "Console",
      link: "console",
      component: (name, link, notify) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
      },
   },
   {
      name: "Snapshots",
      link: "snapshots",
      component: (name, link) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
      },
   },
   {
      name: "Backup",
      link: "backup",
      component: (name, link, notify) => {
         return (
            <Link to={link}>
               <span className="no-icon">{name}</span>
            </Link>
         );
         // return <DownloadBackup name={name} link={link} notify={notify}/>
      },
   },
   // {
   //    name: "Networking",
   //    link: "networking",
   //    component: (name, link) => {
   //       return (
   //          <Link to={link}>
   //             <span className="no-icon">{name}</span>
   //          </Link>
   //       );
   //    },
   // },
   {
      name: "Settings",
      link: "settings",
      component: (name, link, notify) => {
         return <PatchContainer name={name} link={link} notify={notify} />;
      },
   },
];

const routes = [
   {
      path: "/dashboard",
      name: "Dashboard",
      icon: "nc-icon nc-chart-pie-35",
      view: Dashboard,
      layout: "/user",
   },
   {
      path: "/projects",
      name: "Projects",
      icon: "nc-icon nc-notes",
      view: Projects,
      layout: "/user",
   },
   {
      path: "/projects/:projectId",
      name: "Project",
      layout: "/user",
      view: Project,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/info",
      name: "Info",
      navLinks: projectsNavLinks,
      view: ProjectInfo,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers",
      name: "Containers",
      navLinks: projectsNavLinks,
      view: ProjectContainers,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId",
      name: "Project",
      layout: "/user",
      view: Container,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId/info",
      name: "Info",
      navLinks: containerNavLinks,
      view: ContainerInfo,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId/console",
      name: "Console",
      navLinks: containerNavLinks,
      view: ContainerConsole,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId/snapshots",
      name: "Snapshots",
      navLinks: containerNavLinks,
      view: ContainerSnapshots,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId/backup",
      name: "Backup",
      navLinks: containerNavLinks,
      view: ContainerBackup,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers/:containerId/history",
      name: "Backup",
      navLinks: containerNavLinks,
      view: ContainerHistoryState,
      layout: "/user",
   },
   {
      path: "/Profile",
      name: "Profile",
      icon: "nc-icon nc-circle-09",
      view: UserProfile,
      layout: "/user",
   },
];

// {
//   path: "/typography",
//   name: "Typegraphy",
//   sublinks: ["Typography"],
//   icon: "nc-icon nc-paper-2",
//   component: Typography,
//   layout: "/user",
// },
// {
//   path: "/icons",
//   name: "Icons",
//   sublinks: ["Icons"],
//   icon: "nc-icon nc-atom",
//   component: Icons,
//   layout: "/user",
// },
// {
//   path: "/notifications",
//   name: "Notifications",
//   sublinks: ["Notifications"],
//   icon: "nc-icon nc-bell-55",
//   component: Notifications,
//   layout: "/user",
// },
export default routes;
