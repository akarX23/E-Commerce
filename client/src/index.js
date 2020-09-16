import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import promiseMiddleware from "redux-promise";
import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers";
import Routes from "./routes";

import "./styles/main.css";
import "rsuite/dist/styles/rsuite-default.css";
import "bootstrap/dist/css/bootstrap.min.css";

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(
  createStore
);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
