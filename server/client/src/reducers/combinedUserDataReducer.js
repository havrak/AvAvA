import _ from "lodash";
import * as StateCalculator from "service/StateCalculator";

export const combinedUserDataReducer = (state = null, action) => {
   switch (action.type) {
      case "COMBINED_DATA_GET": {
         StateCalculator.addStateToUserData(action.payload);
         return action.payload || null;
      }
      case "USER_PROJECTS_GET": {
         const newState = _.cloneDeep(state);
         newState.userProjects = action.payload;
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "START_SPINNER_PROJECT_POST": {
         const newState = _.cloneDeep(state);
         const project = action.payload;
         project.pendingState = "creating";
         newState.userProjects.projects = [project].concat(
            newState.userProjects.projects
         );
         return newState;
      }
      case "PROJECT_POST_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload.name) {
               newState.userProjects.projects[i] = action.payload;
               break;
            }
         }
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "PROJECT_POST_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               break;
            }
         }
         return newState;
      }
      case "START_SPINNER_PROJECT_DELETE": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = "Deleting";
               break;
            }
         }
         return newState;
      }
      case "PROJECT_DELETE_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               break;
            }
         }
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "PROJECT_DELETE_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = null;
               break;
            }
         }
         return newState;
      }
      //containers
      case "START_SPINNER_CONTAINER_POST": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload.projectId) {
               newState.userProjects.projects[i].containers = [
                  action.payload.container,
               ].concat(newState.userProjects.projects[i].containers);
               break;
            }
         }
         return newState;
      }
      case "CONTAINER_POST_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload.name) {
               newState.userProjects.projects[i] = action.payload;
               break;
            }
         }
         console.log(newState);
         console.log("fsdafdasfjasdfkjdasfdlashfke");
         console.log(action.payload);
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "CONTAINER_POST_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               break;
            }
         }
         return newState;
      }
      case "START_SPINNER_CONTAINER": {
         const newState = _.cloneDeep(state);
         for (const project of newState.userProjects.projects) {
            if (project.id === action.payload.projectId) {
               for (const container of project.containers) {
                  if(container.id === action.payload.containerId){
                     container.pendingState = action.payload.message;
                     return newState;
                  }
               }
            }
         }
      }
      case "CONTAINER_DELETE_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               break;
            }
         }
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "CONTAINER_DELETE_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = null;
               break;
            }
         }
         return newState;
      }
      case "LOGOUT":
         return null;
      default:
         return state;
   }
};
