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
import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Projects from "views/Projects.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import Project from "views/Project.js"
// import Upgrade from "views/Upgrade.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    sublinks: [""],
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/user",
  },
  {
    path: "/projects",
    name: "Projects",
    sublinks: [""],
    icon: "nc-icon nc-notes",
    component: Projects,
    layout: "/user",
  },
  {
    path: "/projects/:projectId",
    name: "Project",
    sublinks: ["Containers", "Info", "Settings"],
    icon: "nc-icon nc-notes",
    component: Project,
    layout: "/user",
  },
  {
    path: "/user",
    name: "User",
    sublinks: ["User Profile"],
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/user",
  },
  {
    path: "/typography",
    name: "Typegraphy",
    sublinks: ["Typography"],
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/user",
  },
  {
    path: "/icons",
    name: "Icons",
    sublinks: ["Icons"],
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/user",
  },
  {
    path: "/notifications",
    name: "Notifications",
    sublinks: ["Notifications"],
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/user",
  },
];

export default dashboardRoutes;
