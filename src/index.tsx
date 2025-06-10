import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PontoProvider } from "./contexts/PontoContext";
import { SalesProvider } from "./contexts/SalesContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <SalesProvider>
      <PontoProvider>
        <App />
      </PontoProvider>
    </SalesProvider>
  </React.StrictMode>
);
