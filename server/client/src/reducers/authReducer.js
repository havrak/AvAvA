export const authReducer = (state = null, action) => {
   switch (action.type) {
      case "GET_USER":
         return action.payload || false;
      case "LOGOUT":
         return null;
      default:
         return state;
   }
};
