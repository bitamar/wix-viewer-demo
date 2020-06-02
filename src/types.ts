export type Data = {
  text?: string;
  src?: string;
  onClick?: () => void;
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
};

export interface Items {
  [id: string]: Item;
}
