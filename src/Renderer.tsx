import React, { useState } from "react";
import {
  ButtonProps,
  IframeProps,
  ImageProps,
  InputProps,
  Item,
  Layout,
  StructureApi,
  TextProps,
} from "./types";
import Remote from "./RemoteRenderer";

function wrapperStyle({ y: top, x: left, width }: Layout): React.CSSProperties {
  return {
    position: "absolute",
    top,
    left,
    width,
  };
}

function elementStyle({ width, height }: Layout): React.CSSProperties {
  return {
    width,
    height,
  };
}

function Button({ data, style, onClick }: ButtonProps): JSX.Element {
  console.log("React rendering Button");

  return (
    <button type="button" style={style} onClick={onClick}>
      {data.text}
    </button>
  );
}

function Image({ data, style }: ImageProps): JSX.Element {
  console.log("React rendering Image");

  return <img src={data.src} alt="" style={style} />;
}

function Input({ data, style, onChange }: InputProps): JSX.Element {
  console.log("React rendering Input");

  return <input onChange={onChange} style={style} value={data.value} />;
}

function Text({ data }: TextProps): JSX.Element {
  console.log("React rendering Text");

  return <span>{data.text}</span>;
}

function Iframe({ id, data, style }: IframeProps): JSX.Element {
  console.log("React rendering Iframe");

  const url = new URL(data.src);

  if (data.params) {
    Object.keys(data.params).forEach((key) => {
      url.searchParams.set(key, data.params[key]);
    });
  }

  // The iframe needs the element id, so it can send it with the messages
  // to the main window.
  url.searchParams.set("id", id);

  return <iframe src={url.href} title={data.title} style={style} />;
}

const components = { Button, Iframe, Image, Input, Remote, Text };

function StructureComponent({
  item,
  structure,
}: {
  item: Item;
  structure: StructureApi;
}): JSX.Element {
  const Component = components[item.type];
  const [state, setState] = useState(false);
  structure.setRenderer(item.id, () => setState(!state));

  return (
    <div style={wrapperStyle(item.layout)} id={item.id}>
      <Component {...item} style={elementStyle(item.layout)} />
    </div>
  );
}

export default function ({
  structure,
}: {
  structure: StructureApi;
}): JSX.Element {
  console.log("React rendering Renderer");

  const items = Object.values(structure.getItems());

  return (
    <>
      {items.map((item) => (
        <StructureComponent key={item.id} item={item} structure={structure} />
      ))}
    </>
  );
}
