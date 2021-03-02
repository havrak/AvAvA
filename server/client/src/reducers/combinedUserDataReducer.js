export const combinedUserDataReducer = (state = null, action) => {
   switch (action.type) {
      case "COMBINED_DATA_GET":
         return action.payload || false;
      case "LOGOUT":
         return null;
      default:
         return state;
   }
};
