export type Layout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type Item = {
  id: string;
  type: "Button" | "Iframe" | "Image" | "Remote" | "Text";
  data: any;
  layout: Layout;
  onClick?: () => void;
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
