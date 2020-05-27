import React, { useEffect } from "react";

import "./Viewer.css";

function Viewer() {
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("http://localhost:3000/siteStructure.json");

      console.log(result);
    };

    fetchData();
  });

  return React.createElement("span", { className: "asdf" }, "hello");
}

export default Viewer;
