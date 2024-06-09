import React from "react";
import ReactDOM from "react-dom/client";
import WSClient from ".//WSClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WSClient />
  </React.StrictMode>,
);
