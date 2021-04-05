import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

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
            console.error(error + 'projectPostError');
            dispatch(projectPostFail(body.name));
            displayFail(body.name);
         } else {
            data.name = 'asdf';
            data.id ='123'; //TESTING PURPOSES
            dispatch(projectPostSuccess(data));
         }
      };
      console.log(body);
      api.projectsPost(body, callback);
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
         // console.log(response, 'project id delete');
         if (error) {
            dispatch(projectDeleteFail(id));
            projectDeleteFailNotification();
         } else {
            dispatch(projectDeleteSuccess(id));
         }
      };
      api.projectsIdDelete(id, callback);
   };
};