import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

export const startSpinnerProjectPost = (project) => {
   return {
      type: "START_SPINNER_PROJECT_POST",
      payload: project,
   };
};

export const projectPostFail = (name) => {
   return {
      type: "PROJECT_POST_FAIL",
      payload: name,
   };
};

export const projectPostSuccess = (project) => {
   return {
      type: "PROJECT_POST_SUCCESS",
      payload: project,
   };
};

export const projectPost = (project, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerProjectPost(project));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(projectPostFail(project.name));
            console.log(error);
            console.log(response);
            notify(`Error occured: ${error.message}`);
         } else {
            data.name = "asdf";
            data.id = "123"; //TESTING PURPOSES
            dispatch(projectPostSuccess(data));
         }
      };
      console.log(project);
      api.projectsPost(project, callback);
   };
};

export const startSpinnerProjectDelete = (projectId) => {
   return {
      type: "START_SPINNER_PROJECT_DELETE",
      payload: projectId, //MAYBE CHANGE
   };
};

export const projectDeleteFail = (projectDd) => {
   return {
      type: "PROJECT_DELETE_FAIL",
      payload: projectDd,
   };
};

export const projectDeleteSuccess = (projectId) => {
   return {
      type: "PROJECT_DELETE_SUCCESS",
      payload: projectId,
   };
};

export const projectIdDelete = (projectId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerProjectDelete(projectId));
      const callback = function (error, data, response) {
         // console.log(response, 'project id delete');
         if (error) {
            dispatch(projectDeleteFail(projectId));
            notify(`Error occured: ${error}`);
         } else {
            dispatch(projectDeleteSuccess(projectId));
         }
      };
      api.projectsIdDelete(projectId, callback);
   };
};
