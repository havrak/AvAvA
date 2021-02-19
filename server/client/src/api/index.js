import axiosLibrary from "axios";
import {Redirect} from "react-router-dom";

const axios = axiosLibrary.create({
   baseURL: "http://localhost:3000/api",
   responseType: "json",
});

export const getCurrentUser = axios.get('/current_user');
export const logout = axios.get('/logout');