import axios from "axios";
import { getCurrentUser, logout as apilogout } from "api";

export const fetchUserAction = () => {
   return (dispatch) => {
      getCurrentUser.then((res) => {
         dispatch({ type: "GET_USER", payload: res.data });
      });
   };
};

export const logout = () => {
   return (dispatch) => {
      apilogout.then((res) => {
         dispatch({ type: "LOGOUT", payload: res.data });
      });
   };
};
