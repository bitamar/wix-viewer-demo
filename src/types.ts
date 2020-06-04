export type Data = {
  text?: string;
  src?: string;
};

export type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type Element = "Button" | "Image" | "Text";

export type Item = {
  id: string;
  type: Element;
  data: Data;
  layout: Layout;
  onClick?: () => void;
};

export interface Items {
  [id: string]: Item;
}

export interface Rerenders {
  [id: string]: () => void;
}

export type Rerender = {
  add: (id: string, renderer: () => void) => void;
  rerender: (id: string) => void;
};
