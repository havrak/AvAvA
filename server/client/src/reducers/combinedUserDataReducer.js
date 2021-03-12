export const combinedUserDataReducer = (state = null, action) => {
   switch (action.type) {
      case "COMBINED_DATA_GET": {
         return action.payload || null;
      }
      case "USER_PROJECTS_GET": {
         return { ...state, userProjects: action.payload };
      }
      case "START_SPINNER_PROJECT_POST": {
         const newState = { ...state };
         const project = action.payload;
         project.pendingState = "creating";
         newState.userProjects.projects.push(project);
         return {...newState};
      }
      case "PROJECT_POST_SUCCESS": {
         const newState = { ...state };
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload.name) {
               newState.userProjects.projects[i].pendingState = null;
            }
         }
         return newState;
      }
      case "PROJECT_POST_FAIL": {
         const newState = { ...state };
         for (let i = 0; i < newState.userProjects.projects.length; i++) {
            if (newState.userProjects.projects[i].name === action.payload.name) {
               newState.userProjects.projects.splice(i, 1);
               return newState;
            }
         }
      }
      case "LOGOUT":
         return null;
      default:
         return state;
   }
};
