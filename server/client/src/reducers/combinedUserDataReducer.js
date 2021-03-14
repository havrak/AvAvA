import _ from "lodash";

export const combinedUserDataReducer = (state = null, action) => {
   switch (action.type) {
      case "COMBINED_DATA_GET": {
         return action.payload || null;
      }
      case "USER_PROJECTS_GET": {
         return { ...state, userProjects: action.payload };
      }
      case "START_SPINNER_PROJECT_POST": {
         const newState = _.cloneDeep(state);
         const project = action.payload;
         project.pendingState = "creating";
         newState.userProjects.projects = [project].concat(
            newState.userProjects.projects
         );
         // newState.userProjects.projects.push(project);
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
               newState.userProjects.projects[i].pendingState = "Deleting"
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
         return newState;
      }
      case "PROJECT_DELETE_FAIL": {
         const newState = _.cloneDeep(state);
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].id === action.payload) {
               newState.userProjects.projects[i].pendingState=null;
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
