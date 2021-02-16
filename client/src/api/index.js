import axiosLibrary from "axios";
import {Redirect} from "react-router-dom";

const axios = axiosLibrary.create({
   baseURL: "https://localhost:3001",
   responseType: "json",
});

// export const login = () => axios.get('/auth/google', ((req, res) => {
//    console.log(res);
// }));

export const login = () => {
   axios
      .get("/auth/google")
      .then(function (response) {
         if (response.user !== undefined) {
         }
         return <Redirect to={"/admin/dashboard"} />;
      })
      .catch(function (error) {
         window.location = "/auth/google";
      });
};

export const logout = () => {
   axios
      .get("/logout")
      .then(function (response) {
         login();
      })
      .catch(function (error) {
         login();
      });
};
