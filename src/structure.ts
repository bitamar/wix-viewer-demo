import { Item, Items, ItemType, StructureApi } from "./types";
import logError from "./utils";

export default function (items: Items): StructureApi {
  const renderers: {
    [id: string]: () => void;
  } = {};

  const render = (id: string) => {
    if (!renderers[id]) {
      logError("no renderer for id", id);
      return;
    }

    renderers[id]();
  };

  return {
    setRenderer: (id: string, renderer: () => void): void => {
      renderers[id] = renderer;
    },
    setData: (id: string, prop: "data" | "layout", override: unknown): void => {
      const item = items[id];
      if (!item) return;
      Object.assign(item[prop], override);
      render(id);
    },
    setEventListener: (
      id: string,
      event: "onClick" | "onChange",
      cb: () => void,
    ): void => {
      const item = items[id];
      if (!item) return;
      item[event] = cb;
      render(id);
    },
    getItems: (): Items => items,
    getItemsByType: (type: ItemType): Item[] => {
      return Object.values(items).filter((item) => item.type === type);
    },
  };
}
