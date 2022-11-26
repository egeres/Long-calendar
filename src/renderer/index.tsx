
// Old way
// import { render } from 'react-dom';
// import App from './App';
// render(<App />, document.getElementById('root'));

// Taken from https://stackoverflow.com/questions/71668256/deprecation-notice-reactdom-render-is-no-longer-supported-in-react-18
// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
//   <React.StrictMode>
    <App />
//   </React.StrictMode>
);
