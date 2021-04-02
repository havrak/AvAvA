import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { getCurrentProject, getCurrentProjectAndContainer } from "service/RoutesHelper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { isActive } from "service/RoutesHelper";
import { Collapse } from "react-bootstrap";

export function SidebarLink({ route, icon, name }) {
   console.log(route, icon, name)
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
               <Tooltip className="dropdown-toggler" title="Display projects">
                  <IconButton
                     color="inherit"
                     aria-label="delete"
                     onClick={(e) => {
                        // console.log($(e.target));
                        e.preventDefault();
                        setShown(!shown);
                     }}
                  >
                     {shown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </IconButton>
               </Tooltip>
            </NavLink>
         </li>
         <Collapse className="sidebar-collapsed-block" in={shown}>
            <div>
               {toCollapse}
            </div>
         </Collapse>
      </>
   );
}
