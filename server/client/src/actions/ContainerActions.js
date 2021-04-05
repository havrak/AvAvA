import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

export const startSpinnerContainerPost = (projectId, container) => {
   return {
      type: "START_SPINNER_CONTAINER_POST",
      payload: {
         projectId: projectId,
         container: container
      },
   };
};

export const containerPostFail = (project, container) => {
   return {
      type: "CONTAINER_POST_FAIL",
      payload: {
         project: project,
         container: container
      },
   };
};

export const containerPostSuccess = (project, container) => {
   return {
      type: "CONTAINER_POST_SUCCESS",
      payload: {
         project: project,
         container: container
      },
   };
};

export const containerPost = (body, displayFail) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
            console.error(error + "containerPostError");
            dispatch(containerPostFail(body.name));
            displayFail(body.name);
         } else {
            // data.name = "asdf";
            // data.id = "123"; //TESTING PURPOSES
            dispatch(containerPostSuccess(data));
         }
      };
      console.log(body);
      api.instancesPost(body, callback);
   };
};

export const startSpinnerContainer = (projectId, containerId, message) => {
   return {
      type: "START_SPINNER_CONTAINER",
      payload: {
         projectId: projectId,
         containerId: containerId,
         message: message
      }, //MAYBE CHANGE
   };
};

export const containerDeleteFail = (projectId, containerId) => {
   return {
      type: "CONTAINER_ACTION_FAIL",
      payload: {
         projectId: projectId,
         containerId: containerId,
      },
   };
};

export const containerDeleteSuccess = (projectId, containerId) => {
   return {
      type: "CONTAINER_ACTION_SUCCESS",
      payload: {
         projectId: projectId,
         containerId: containerId,
      },
   };
};

export const containerIdStart = (projectId, containerId, containerDeleteFailNotification) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (error) {
            dispatch(containerDeleteFail(id));
            containerDeleteFailNotification();
         } else {
            dispatch(containerDeleteSuccess(id));
         }
      };
      api.instancesIdStart(containerId, callback);
   };
};

export const containerIdStop = (projectId, containerId, containerDeleteFailNotification) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (error) {
            dispatch(containerDeleteFail(id));
            containerDeleteFailNotification();
         } else {
            dispatch(containerDeleteSuccess(id));
         }
      };
      api.instancesIdStop(containerId, callback);
   };
};

export const containerIdFreeze = (projectId, containerId, containerDeleteFailNotification) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (error) {
            dispatch(containerDeleteFail(id));
            containerDeleteFailNotification();
         } else {
            dispatch(containerDeleteSuccess(id));
         }
      };
      api.instancesIdFreeze(containerId, callback);
   };
};

export const containerIdDelete = (projectId, containerId, containerDeleteFailNotification) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (error) {
            dispatch(containerDeleteFail(id));
            containerDeleteFailNotification();
         } else {
            dispatch(containerDeleteSuccess(id));
         }
      };
      api.instancesIdDelete(id, callback);
   };
};