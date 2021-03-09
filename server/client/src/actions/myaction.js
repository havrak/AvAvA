import axios from "axios";

import * as UserApi from "../api/index";

const api = new UserApi.DefaultApi();

export const userProjectsGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data);
         if (error) {
            console.error(error);
         } else {
            dispatch({ type: "USER_PROJECTS_GET", payload: data });
            console.log(data);
         }
      };
      api.userProjectsGet(callback);
   };
};

export const combinedDataGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data);
         if (error) {
            console.error(error);
         } else {
            dispatch({ type: "COMBINED_DATA_GET", payload: data });
            console.log(data);
         }
      };
      api.combinedDataGet(callback);
   };
};

export const logout = () => {
   return (dispatch) => {
      apilogout.then((res) => {
         dispatch({ type: "LOGOUT", payload: res.data });
      });
   };
};
