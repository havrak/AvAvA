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
import Dashboard from "views/User/Dashboard.js";
import UserProfile from "views/User/UserProfile.js";
import Projects from "views/User/Projects.js";
import Typography from "views/Other/Typography.js";
import Icons from "views/Other/Icons.js";
import Notifications from "views/Other/Notifications.js";
import Project from "views/Projects/Project.js";
import ProjectContainers from "views/Projects/Containers.js";
import ProjectInfo from "views/Projects/Info.js";
import ProjectSettings from "views/Projects/Settings.js";
// import Upgrade from "views/Upgrade.js";

const projectsNavLinks = [
   {
      name: "Containers",
      link: "containers",
   },
   {
      name: "Info",
      link: "info",
   },
   {
      name: "Settings",
      link: "settings",
   },
];

const routes = [
   {
      path: "/dashboard",
      name: "Dashboard",
      icon: "nc-icon nc-chart-pie-35",
      view: Dashboard,
      addToNavigation: true,
      layout: "/user",
   },
   {
      path: "/projects",
      name: "Projects",
      icon: "nc-icon nc-notes",
      view: Projects,
      addToNavigation: true,
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
      name: "-Info",
      navLinks: projectsNavLinks,
      view: ProjectInfo,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/containers",
      name: "-Containers",
      navLinks: projectsNavLinks,
      view: ProjectContainers,
      layout: "/user",
   },
   {
      path: "/projects/:projectId/settings",
      name: "-Settings",
      navLinks: projectsNavLinks,
      view: ProjectSettings,
      layout: "/user",
   },
   {
      path: "/user",
      name: "User",
      icon: "nc-icon nc-circle-09",
      view: UserProfile,
      addToNavigation: true,
      layout: "/user",
   },
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
];

export default routes;
