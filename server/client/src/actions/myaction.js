import axios from "axios";

import * as UserApi from "../api/index";

const api = new UserApi.DefaultApi();

export const combinedDataGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data + 'combined data get');
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

export const userProjectsGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data + 'user projects get');
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

export const projectIdDelete = (id) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data + 'project id delete');
         if (error) {
            console.error(error);
         } else {
            dispatch({ type: "PROJECT_ID_DELETE", payload: data });
            console.log(data);
         }
      };
      api.projectIdDelete(id, callback);
   };
};

export const logout = () => {
   return (dispatch) => {
      apilogout.then((res) => {
         dispatch({ type: "LOGOUT", payload: res.data });
      });
   };
};
