export const combinedUserDataReducer = (state = null, action) => {
   switch (action.type) {
      case "COMBINED_DATA_GET":
         return action.payload || null;
      case "USER_PROJECTS_GET":
         return { ...state, userProjects: action.payload };
      case "LOGOUT":
         return null;
      default:
         return state;
   }
};
