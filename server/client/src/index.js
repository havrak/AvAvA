import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { combinedUserDataReducer } from "reducers/combinedUserDataReducer";
import FrontendReducer from "reducers/FrontendReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function saveToLocalStorage(state) {
   try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("state", serializedState);
   } catch (e) {
      console.log(e);
   }
}

function loadFromLocalStorage() {
   try {
      const serializedState = localStorage.getItem("state");
      if (serializedState === null) {
         return undefined;
      }
      return JSON.parse(serializedState);
   } catch (e) {
      console.log(e);
      return undefined;
   }
}

const rootReducer = combineReducers({
   combinedUserData: combinedUserDataReducer,
   frontend: FrontendReducer
});

const persistedState = loadFromLocalStorage();

const store = createStore(
   rootReducer,
   persistedState,
   composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
   console.log("saving to localstorage");
   return saveToLocalStorage(store.getState());
});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
   document.getElementById("root")
);

export default store;
