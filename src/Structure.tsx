import React, { CSSProperties } from "react";

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

type Element = "Button" | "Image" | "Text";

export type Structure = {
  id: string;
  type: Element;
  customId?: string;
  data: Data;
  layout: Layout;
};

type Props = { structure: Structure };

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

function Button(props: Props): JSX.Element {
  const { data, layout } = props.structure;
  return <button style={layoutStyle(layout)}>{data.text}</button>;
}

function Image(props: Props): JSX.Element {
  const { data, layout } = props.structure;
  return <img style={layoutStyle(layout)} src={data.src} alt="" />;
}

function Text(props: Props): JSX.Element {
  const { data, layout } = props.structure;
  return <span style={layoutStyle(layout)}>{data.text}</span>;
}

export function getComponent(name: Element): (props: Props) => JSX.Element {
  // noinspection JSUnusedGlobalSymbols
  const components = {
    Button: Button,
    Text: Text,
    Image: Image,
  };
  return components[name];
}
