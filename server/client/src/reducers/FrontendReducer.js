import _ from "lodash";

const defaultState = {
   brand: [{ text: "" }],
};

const FrontendReducer = (state, action) => {
   if (!state) {
      state = defaultState;
   }
   switch (action.type) {
      case "SET_CUSTOMIZABLE_BRAND_TEXT": {
         const newState = _.cloneDeep(state);
         newState.brand = action.payload;
         return newState;
      }
      case "LOGOUT":
         return null;
   }
   return state;
};

export default FrontendReducer;
