/* eslint-disable no-console */

import React from "react";

type Data = {
  text?: string;
  src?: string;
  onClick?: () => void;
};

type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type Element = "Button" | "Image" | "Text";

export type Item = {
  id: string;
  type: Element;
  customId?: string;
  data: Data;
  layout: Layout;
};

export function itemId({ customId, id }: Item): string {
  return customId || id;
}

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
  item: Item;
  style: React.CSSProperties;
};

// TODO: Set text should only re-run this function (Not image etc.)
function Button({ item, style }: Props): JSX.Element {
  console.log("Button");

  const { data } = item;

  return (
    <button type="button" style={style} onClick={data.onClick}>
      {data.text}
    </button>
  );
}

function Image({ item, style }: Props): JSX.Element {
  console.log("Image");
  const { data } = item;
  // TODO: Add optional caption below the image.
  return <img src={data.src} alt="" style={style} />;
}

function Text({ item }: Props): JSX.Element {
  console.log("Text");
  const { data } = item;
  return <span>{data.text}</span>;
}

function renderComponent(item: Item): JSX.Element | undefined {
  const components = { Button, Text, Image };
  const Component = components[item.type];

  if (!Component) return undefined;

  // TODO: Maybe change to prop spreading.
  return (
    <div key={item.id} style={wrapperStyle(item.layout)} id={itemId(item)}>
      <Component item={item} style={elementStyle(item.layout)} />
    </div>
  );
}

export default function ({ items }: { items: Item[] }): JSX.Element {
  console.log("Renderer");

  return <div id="renderer">{items.map(renderComponent)}</div>;
}
