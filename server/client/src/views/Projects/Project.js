import React from "react";
import { Redirect } from "react-router-dom";

function Project(props){
   let path = location.pathname;
   if(path.endsWith('/')){
      path += "containers";
   } else {
      path += "/containers";
   }
   return <Redirect to={path} />
}

export default Project;