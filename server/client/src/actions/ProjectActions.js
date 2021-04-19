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
            console.log(response);
            notify(`Error occured: ${response?.body?.message}`);
         } else {
            // data.name = "asdf";
            // data.id = "123"; //TESTING PURPOSES
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

const projectStateChangeFail = (projectId) => {
   return {
      type: "PROJECT_STATE_CHANGE_FAIL",
      payload: projectId,
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
            dispatch(projectStateChangeFail(projectId));
            notify(`Error occured: ${response?.body?.message}`);
         } else {
            dispatch(projectDeleteSuccess(projectId));
         }
      };
      api.projectsIdDelete(projectId, callback);
   };
};

export const projectIdGet = (projectId, notify) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
            notify(`Error occured: ${response?.body?.message}`);
         } else {
            dispatch(projectGetSuccess(data));
         }
      };
      api.projectsIdGet(projectId, callback);
   };
};

export const projectIdPatch = (patchedProject, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerProjectPatch(patchedProject.id));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(projectStateChangeFail(patchedProject.id));
            notify(`Error occured: ${response?.body?.message}`);
         } else {
            console.log(data, "success");
            dispatch(projectGetSuccess(data));
         }
      };
      console.log(patchedProject);
      api.projectsIdPatch(patchedProject, patchedProject.id, callback);
   };
};

const startSpinnerProjectPatch = (projectId) => {
   return {
      type: "START_SPINNER_PROJECT_PATCH",
      payload: projectId,
   };
};

const projectGetSuccess = (project) => {
   return {
      type: "PROJECT_GET_SUCCESS",
      payload: project,
   };
};
