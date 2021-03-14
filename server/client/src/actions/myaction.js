import axios from "axios";

import * as UserApi from "../api/index";

const api = new UserApi.DefaultApi();

export const combinedDataGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
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
         if (error) {
            console.error(error);
            console.log('userProjectsGet')
         } else {
            dispatch({ type: "USER_PROJECTS_GET", payload: data });
            console.log(data);
         }
      };
      api.userProjectsGet(callback);
   };
};

export const startSpinnerProjectPost = (body) => {
   return {
      type: "START_SPINNER_PROJECT_POST",
      payload: body
   }
}

export const projectPostFail = (name) => {
   return {
      type: "PROJECT_POST_FAIL",
      payload: name
   }
}

export const projectPostSuccess = (project) => {
   return {
      type: "PROJECT_POST_SUCCESS",
      payload: project
   }
}

export const projectPost = (body, displayFail) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
            console.error(error);
            console.log('projectPost')
            dispatch(projectPostFail(body.name));
            displayFail(body.name);
         } else {
            data.id=15;
            data.name="asdf" //EDITING PURPOSES
            dispatch(projectPostSuccess(data));
         }
      };
      api.projectPost(body, callback);
   };
}

export const startSpinnerProjectDelete = (project) => {
   return {
      type: "START_SPINNER_PROJECT_DELETE",
      payload: project.id //MAYBE CHANGE
   }
}

export const projectDeleteFail = (id) => {
   return {
      type: "PROJECT_DELETE_FAIL",
      payload: id
   }
}

export const projectDeleteSuccess = (id) => {
   return {
      type: "PROJECT_DELETE_SUCCESS",
      payload: id
   }
}

export const projectIdDelete = (id, projectDeleteFailNotification) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         console.log(data + 'project id delete');
         if (error) {
            dispatch(projectDeleteFail(id));
            projectDeleteFailNotification();
         } else {
            dispatch(projectDeleteSuccess(id));
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
