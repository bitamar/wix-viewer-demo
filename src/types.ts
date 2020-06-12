import React, { ChangeEvent } from "react";

export type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

interface ComponentProps {
  style: React.CSSProperties;
  data: Record<string, unknown>;
}

export interface ButtonProps extends ComponentProps {
  data: { text: string };
  onClick?: () => void;
}

export interface ImageProps extends ComponentProps {
  data: { src: string };
}

export interface InputProps extends ComponentProps {
  data: { value?: string };
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface TextProps extends ComponentProps {
  data: { text: string };
}

export interface IframeProps extends ComponentProps {
  id: string;
  data: { src: string; title: string; params: { [key: string]: string } };
}

export interface RemoteProps extends ComponentProps {
  data: { componentName: string; src: string };
}

export type ItemType =
  | "Button"
  | "Iframe"
  | "Image"
  | "Input"
  | "Remote"
  | "Text";

export type Item = {
  id: string;
  type: ItemType;
  data: any;
  layout: Layout;
  onClick?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type Items = {
  [id: string]: Item;
};

export type StructureApi = {
  setRenderer: (id: string, render: () => void) => void;
  setData: (id: string, prop: "data" | "layout", override: unknown) => void;
  setEventListener: (
    id: string,
    event: "onClick" | "onChange",
    cb: () => void,
  ) => void;
  getItems: (typeFilter?: ItemType) => Items;
  getItemsByType: (typeFilter: ItemType) => Item[];
};
