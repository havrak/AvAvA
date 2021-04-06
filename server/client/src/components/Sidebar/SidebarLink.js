import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { getCurrentProject, getCurrentProjectAndContainer } from "service/RoutesHelper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import IconButton from "@material-ui/core/IconButton";
import { isActive, shouldOpenBasedOnLocation } from "service/RoutesHelper";
import { Collapse } from "react-bootstrap";

export function SidebarLink({ route, icon, name }) {
   return (
      <li className={isActive(route) ? "active" : ""}>
         <NavLink to={route} className="nav-link" activeClassName="active">
            {icon ? <i className={icon} />: "" }
            <p>{name}</p>
         </NavLink>
      </li>
   );
}

export function SidebarLinkWithDropdown({ route, icon, name, toCollapse }) {
   const [shown, setShown] = useState(false);

   return (
      <>
         <li className={isActive(route) ? "active" : ""} >
            <NavLink to={route} className="nav-link" activeClassName="active">
               {icon ? <i className={icon} /> : "" }
               <p>{name}</p>
                  <IconButton
                  className="dropdown-toggler"
                     color="inherit"
                     aria-label="collapseButton"
                     onClick={(e) => {
                        // console.log($(e.target));
                        e.preventDefault();
                        setShown(!shown);
                     }}
                  >
                     {shown || shouldOpenBasedOnLocation(route) ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </IconButton>
            </NavLink>
         </li>
         <Collapse className="sidebar-collapsed-block" in={shown || shouldOpenBasedOnLocation(route)}>
            <div>
               {toCollapse}
            </div>
         </Collapse>
      </>
   );
}
