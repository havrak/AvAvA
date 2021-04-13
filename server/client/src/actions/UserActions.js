import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

export const combinedDataGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
         } else {
            dispatch({ type: "COMBINED_DATA_GET", payload: data });
         }
      };
      api.combinedDataGet(callback);
   };
};

export const userProjectsGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
         } else {
            dispatch({ type: "USER_PROJECTS_GET", payload: data });
         }
      };
      api.projectsGet(callback);
   };
};

export const logout = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         dispatch({ type: "LOGOUT", payload: {} });
      };
      api.logoutGet(callback);
   };
};
