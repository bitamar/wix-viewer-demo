import React, { useEffect, useState } from "react";
import { Item, Layout, Rerender } from "./types";

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

type ButtonProps = {
  data: { text: string };
  style: React.CSSProperties;
  onClick?: () => void;
};
function Button({ data, style, onClick }: ButtonProps): JSX.Element {
  console.log("Button");

  return (
    <button type="button" style={style} onClick={onClick}>
      {data.text}
    </button>
  );
}

type ImageProps = {
  data: { src: string };
  style: React.CSSProperties;
};
function Image({ data, style }: ImageProps): JSX.Element {
  console.log("Image");

  return <img src={data.src} alt="" style={style} />;
}

type TextProps = {
  data: { text: string };
  style: React.CSSProperties;
};
function Text({ data }: TextProps): JSX.Element {
  console.log("Text");

  return <span>{data.text}</span>;
}

type IframeParams = { [key: string]: string };
type IframeProps = {
  id: string;
  data: { src: string; title: string; params: IframeParams };
  style: React.CSSProperties;
};
function Iframe({ id, data, style }: IframeProps): JSX.Element {
  console.log("Iframe");

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

type RemoteProps = {
  data: { src: string };
  style: React.CSSProperties;
};
function Remote({ data }: RemoteProps): JSX.Element {
  const fetchText = async (request: RequestInfo): Promise<string> => {
    const response = await fetch(request);
    return response.text();
  };

  useEffect(() => {
    fetchText(data.src).then((code) => {
      // console.log(code);
    });
  });
  return <div>{data.src}</div>;
}

const components = { Button, Iframe, Image, Remote, Text };

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
