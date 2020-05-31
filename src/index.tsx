import React from "react";
import { render } from "react-dom";
import Viewer from "./Viewer";
import { Structure } from "./Structure";
import "./index.css";

async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

const root = document.getElementById("root");
if (root) {
  (async () => {
    const url = "http://localhost:3000/siteStructure.json";
    const structure = await fetchJson<Structure[]>(url);
    render(<Viewer structure={structure} root={root} />, root);
  })();
}
