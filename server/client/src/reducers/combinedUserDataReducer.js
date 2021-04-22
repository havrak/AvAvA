import _ from "lodash";
import * as StateCalculator from "service/StateCalculator";
import {debug} from 'config.js';

export const combinedUserDataReducer = (state = null, action) => {
   if(debug){
      console.log('REDUCER --- ', 'TYPE: ', action.type, '///', 'PAYLOAD:', action.payload);
   }
   switch (action.type) {
      case "COMBINED_DATA_GET": {
         StateCalculator.addStateToUserData(action.payload);
         return action.payload;
      }
      case "USER_PROJECTS_GET": {
         const newState = _.cloneDeep(state);
         newState.userProjects = action.payload;
         StateCalculator.addStateToUserData(newState);
         return newState;
      }
      case "PROJECT_GET_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload.id) {
               newState.userProjects.projects[i] = action.payload;
               StateCalculator.addStateToUserData(newState);
               return newState;
            }
         }
         // newState.userProjects.projects = [action.pyaload].concat(
         //    newState.userProjects.projects
         // );
         break;
      }
      case "START_SPINNER_PROJECT_POST": {
         const newState = _.cloneDeep(state);
         const project = action.payload;
         project.pendingState = "Creating";
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
               StateCalculator.addStateToUserData(newState);
               return newState;
            }
         }
         break;
      }
      case "PROJECT_POST_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               return newState;
            }
         }
         break;
      }
      case "START_SPINNER_PROJECT_DELETE": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = "Deleting";
               return newState;
            }
         }
         break;
      }
      case "START_SPINNER_PROJECT_PATCH": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = "Changing settings";
               return newState;
            }
         }
         break;
      }
      case "PROJECT_DELETE_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects.splice(i, 1);
               StateCalculator.addStateToUserData(newState);
               return newState;
            }
         }
         break;
      }
      case "PROJECT_STATE_CHANGE_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState = null;
               return newState;
            }
         }
         break;
      }
      //containers
      case "START_SPINNER_CONTAINER_POST": {
         const newState = _.cloneDeep(state);
         action.payload.container.pendingState = "Creating";
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload.projectId) {
               newState.userProjects.projects[i].containers = [
                  action.payload.container,
               ].concat(newState.userProjects.projects[i].containers);
               // StateCalculator.addStateToUserData(newState);
               return newState;
            }
         }
         break;
      }
      case "CONTAINER_POST_SUCCESS": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         console.log(action.payload);
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === action.payload.projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].name === action.payload.container.name) {
                     projects[i].containers[j] = action.payload.container;
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CONTAINER_POST_FAIL": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === action.payload.projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].name === action.payload.containerName) {
                     projects[i].containers.splice(j, 1);
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "START_SPINNER_CONTAINER": {
         const newState = _.cloneDeep(state);
         for (const project of newState.userProjects.projects) {
            if (project.id === action.payload.projectId) {
               for (const container of project.containers) {
                  if (container.id === action.payload.containerId) {
                     container.pendingState = action.payload.message;
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "START_SPINNER_CONTAINER_PATCH": {
         const newState = _.cloneDeep(state);
         for (const project of newState.userProjects.projects) {
            if (project.id === action.payload.projectId) {
               for (const container of project.containers) {
                  if (container.id === action.payload.containerId) {
                     container.pendingState = action.payload = "Changing container state";
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CONTAINER_DELETE_SUCCESS": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === action.payload.projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].id === action.payload.containerId) {
                     projects[i].containers.splice(j, 1);
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CONTAINER_STATE_CHANGE_SUCCESS": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === action.payload.projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].id === action.payload.container.id) {
                     projects[i].containers[j] = action.payload.container;
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CONTAINER_STATE_CHANGE_FAIL": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === action.payload.projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].id === action.payload.containerId) {
                     projects[i].containers[j].pendingState = null;
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CONTAINER_GET_SUCCESS": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload.projectId) {
               for (
                  let j = 0;
                  j < newState.userProjects.projects[i].containers.length;
                  j++
               ) {
                  if (
                     newState.userProjects.projects[i].containers[j].id ===
                     action.payload.container.id
                  ) {
                     newState.userProjects.projects[i].containers[j] = action.payload.container;
                     
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         // newState.userProjects.projects[action.payload.projectId].containers = [action.payload.container].concat(
         //    newState.userProjects.projects[action.payload.projectId].containers
         // );
         break;
      }
      case "INSTANCES_ID_STATE_WITH_HISTORY_GET_SUCCESS": {
         const newState = _.cloneDeep(state);
         const projects = newState.userProjects.projects;
         const {containerId, projectId, stateHistory} = action.payload;
         for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === projectId) {
               for (let j = 0; j < projects[i].containers.length; j++) {
                  if (projects[i].containers[j].id === containerId) {
                     const container = projects[i].containers[j];
                     container.state = stateHistory[stateHistory.length - 1];
                     container.stateHistory = stateHistory;
                     StateCalculator.addStateToUserData(newState);
                     return newState;
                  }
               }
            }
         }
         break;
      }
      case "CREATE_INSTANCE_CONFIG_DATA_GET":
         const newState = _.cloneDeep(state);
         newState.createInstanceConfigData = action.payload;
         return newState;
      case "LOGOUT":
         return null;
      default:
         return state;
   }
   return state;
};
