import routes from "routes.js";
import _ from "lodash";

function removeEndSlashPathEndAndSplit() {
   let path = _.cloneDeep(location.pathname);
   if (path.endsWith("/")) {
      path = path.slice(0, -1);
   }
   return path.split("/");
}

export function relativeLocation(toRelativeLocation) {
   const splitted = removeEndSlashPathEndAndSplit();
   splitted[splitted.length - 1] = toRelativeLocation;
   return splitted.join("/");
}

export function toChildLocation(toChildLocation) {
   let splitted = removeEndSlashPathEndAndSplit();
   splitted.push(toChildLocation);
   return splitted.join("/");
}

export function removePathParts(pathPartsToRemove) {
   let splitted = removeEndSlashPathEndAndSplit();
   splitted = splitted.slice(0, -pathPartsToRemove);
   return splitted.join("/");
}

export function getValidRoute() {
   let splittedPath = removeEndSlashPathEndAndSplit();
   let splittedRoutes = [];
   for (const route of routes) {
      splittedRoutes.push(route.path.split("/"));
      splittedRoutes[splittedRoutes.length - 1].splice(
         1,
         0,
         route.layout.substring(1, route.layout.length)
      );
   }

   let foundMistake = false;
   for (let i = 0; i < splittedRoutes.length; i++) {
      if (splittedRoutes[i].length === splittedPath.length) {
         for (let j = 0; j < splittedPath.length; j++) {
            if (
               splittedPath[j] !== splittedRoutes[i][j] &&
               !splittedRoutes[i][j].startsWith(":")
            ) {
               foundMistake = true;
               break;
            }
         }
         if (!foundMistake) {
            return routes[i];
         }
         foundMistake = false;
      }
   }
   return -1;
}

function currentProjectId() {
   const splitted = removeEndSlashPathEndAndSplit();
   return {
      projectId: parseInt(splitted[3])
   }
}

export function getCurrentProject(projects){
   const {projectId} = currentProjectId();
   for(const project of projects){
      if(project.id === projectId){
         return project;
      }
   }
}

function currentProjectAndContainerId() {
   const splitted = removeEndSlashPathEndAndSplit();
   return {
      projectId: parseInt(splitted[3]),
      containerId: parseInt(splitted[5])
   }
}

export function getCurrentProjectAndContainer(projects){
   const {containerId, projectId} = currentProjectAndContainerId();
   for(const project of projects){
      if(project.id === currentProjectId){
         for(const container of project.containers){
            return {
               currentProject: project,
               currentContainer: container
            }
         }
      }
   }
}

export function isActive(routeName) {
   return location.pathname.indexOf(routeName) > -1;
}