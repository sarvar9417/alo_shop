import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Store from "./Config/store";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <>
      <Router>
        <Provider store={Store}>
          <App />
        </Provider>
      </Router>
      <ToastContainer
        position="top-right"
        theme={"colored"}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </>,
    rootElement
  );
} else {
  root.render(
    <>
      <Router>
        <Provider store={Store}>
          <App />
        </Provider>
      </Router>
      <ToastContainer
        position="top-right"
        theme={"colored"}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </>
  );
}
