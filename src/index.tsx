import React from "react";
import { render } from "react-dom";
import Viewer from "./Viewer";

import "./index.css";

render(
  <React.StrictMode>
    <Viewer />
  </React.StrictMode>,
  document.getElementById("root"),
);
