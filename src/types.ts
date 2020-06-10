import { ChangeEvent } from "react";

export type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type Item = {
  id: string;
  type: "Button" | "Iframe" | "Image" | "Input" | "Remote" | "Text";
  data: any;
  layout: Layout;
  onClick?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type Items = {
  [id: string]: Item;
};

export type Rerenders = {
  [id: string]: () => void;
};

export type Rerender = {
  add: (id: string, renderer: () => void) => void;
  rerender: (id: string) => void;
};
