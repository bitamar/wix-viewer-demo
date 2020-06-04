import React, { useState } from "react";
import { Data, Item, Layout, Rerender } from "./types";

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

// TODO: Iframe component that can enlarge itself.

// TODO: Component from url in the structure.

const components = { Button, Text, Image };

function StructureComponent({
  item,
  rerender,
}: {
  item: Item;
  rerender: Rerender;
}): JSX.Element {
  const Component = components[item.type];
  const [state, setState] = useState(false);

  rerender.add(item.id, () => setState(!state));

  return (
    <div style={wrapperStyle(item.layout)} id={item.id}>
      <Component {...item} style={elementStyle(item.layout)} />
    </div>
  );
}

export default function ({
  items,
  rerender,
}: {
  items: Item[];
  rerender: Rerender;
}): JSX.Element {
  console.log("Renderer");

  return (
    <div id="renderer">
      {items.map((item) => (
        <StructureComponent key={item.id} item={item} rerender={rerender} />
      ))}
    </div>
  );
}
