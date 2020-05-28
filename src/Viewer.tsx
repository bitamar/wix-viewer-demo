import React, { CSSProperties, useEffect, useState } from "react";

type Data = {
  text?: string;
  src?: string;
};

type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type Structure = {
  id: string;
  type: "Button" | "Image" | "Text";
  customId?: string;
  data: Data;
  layout: Layout;
};

function Button(props: { structure: Structure }) {
  const { data, layout } = props.structure;
  return <button style={layoutStyle(layout)}>{data.text}</button>;
}

function Image(props: { structure: Structure }) {
  const { data, layout } = props.structure;
  return <img style={layoutStyle(layout)} src={data.src} alt="" />;
}

function Text(props: { structure: Structure }) {
  const { data, layout } = props.structure;
  return <span style={layoutStyle(layout)}>{data.text}</span>;
}

export async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return await response.json();
}

const components = {
  Button: Button,
  Text: Text,
  Image: Image,
};

function layoutStyle({ x, y, width, height }: Layout): CSSProperties {
  const css: CSSProperties = {
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
  };
  if (width) css["width"] = `${width}px`;
  if (height) css["height"] = `${height}px`;

  return css;
}

function Viewer() {
  const [structure, setStructure] = useState<Structure[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchJson<Structure[]>(
        "http://localhost:3000/siteStructure.json"
      );
      setStructure(data);
    })();
  }, []);

  const elements = structure.map((item, i) => {
    const Component = components[item.type];
    if (Component) return <Component key={i} structure={item} />;
  });

  return <>{elements}</>;
}

export default Viewer;
