import React from "react";

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

export function itemId({ customId, id }: Structure): string {
  return customId || id;
}

function getStyle(layout: Layout): React.CSSProperties {
  const css: React.CSSProperties = {
    position: "absolute",
    top: `${layout.y}px`,
    left: `${layout.x}px`,
  };

  if (layout.width) css.width = `${layout.width}px`;
  if (layout.height) css.height = `${layout.height}px`;

  return css;
}

type Props = { structure: Structure };

function Button({ structure }: Props): JSX.Element {
  const { data, layout } = structure;
  return (
    <button type="button" style={getStyle(layout)} id={itemId(structure)}>
      {data.text}
    </button>
  );
}

function Image({ structure }: Props): JSX.Element {
  const { data, layout } = structure;
  return (
    <img
      style={getStyle(layout)}
      id={itemId(structure)}
      src={data.src}
      alt=""
    />
  );
}

function Text({ structure }: Props): JSX.Element {
  const { data, layout } = structure;
  return (
    <span style={getStyle(layout)} id={itemId(structure)}>
      {data.text}
    </span>
  );
}

export function getComponent(name: Element): (props: Props) => JSX.Element {
  // noinspection JSUnusedGlobalSymbols
  const components = {
    Button,
    Text,
    Image,
  };
  return components[name];
}
