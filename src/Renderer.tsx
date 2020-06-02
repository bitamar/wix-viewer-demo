/* eslint-disable no-console,react/jsx-props-no-spreading */

import React from "react";
import { Data, Item, Layout } from "./types";

function wrapperStyle(layout: Layout): React.CSSProperties {
  return {
    position: "absolute",
    top: `${layout.y}px`,
    left: `${layout.x}px`,
  };
}

function elementStyle(layout: Layout): React.CSSProperties {
  const css: React.CSSProperties = {};

  if (layout.width) css.width = `${layout.width}px`;
  if (layout.height) css.height = `${layout.height}px`;

  return css;
}

type Props = {
  data: Data;
  style: React.CSSProperties;
  onClick?: () => void;
};

function Button({ data, style, onClick }: Props): JSX.Element {
  console.log("Button");

  return (
    <button type="button" style={style} onClick={onClick}>
      {data.text}
    </button>
  );
}

function Image({ data, style }: Props): JSX.Element {
  console.log("Image");

  return <img src={data.src} alt="" style={style} />;
}

function Text({ data }: Props): JSX.Element {
  console.log("Text");
  return <span>{data.text}</span>;
}

function renderComponent(item: Item): JSX.Element | undefined {
  const components = { Button, Text, Image };
  const Component = components[item.type];

  if (!Component) return undefined;

  return (
    <div key={item.id} style={wrapperStyle(item.layout)} id={item.id}>
      <Component {...item} style={elementStyle(item.layout)} />
    </div>
  );
}

export default function ({ items }: { items: Item[] }): JSX.Element {
  console.log("Renderer");

  return <div id="renderer">{items.map(renderComponent)}</div>;
}
