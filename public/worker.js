// TODO: Can the eval code be prevented from changing the callbacks list?

// structureMap keeps track of everything $w need to return from getters.
let itemsMap = new Map();
const callbacks = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function $w(selector) {
  const elementId = selector.substring(1);

  const item = itemsMap[elementId];
  if (!item) return undefined;

  const properties = {
    Button: {
      onClick(callback) {
        const callbackId = callbacks.length;
        callbacks.push(callback);
        console.log("added callback #", callbackId);
        postMessage({ command: "setOnClick", selector, callbackId });
      },
    },

    Image: {
      set src(src) {
        item.data.src = src;
        postMessage({ command: "setData", selector, overrideData: { src } });
      },

      get src() {
        return item.data.src;
      },
    },

    Text: {
      set text(text) {
        item.data.text = text;
        postMessage({ command: "setData", selector, overrideData: { text } });
      },

      get text() {
        return item.data.text;
      },
    },

    Iframe: {
      set params(params) {
        item.data.params = params;
        postMessage({ command: "setData", selector, overrideData: { params } });
      },

      get params() {
        return item.data.params;
      },
    },
  };
  return properties[item.type];
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = async ({ data }) => {
  console.log("main to userCode", data);

  const commands = {
    init: () => {
      itemsMap = data.itemsMap;

      fetch(data.codeUrl)
        .then((response) => response.text())
        // eslint-disable-next-line no-eval
        .then((code) => eval(code))
        .then(() => postMessage({ command: "userCodeRan" }));
    },
    callback: () => callbacks[data.callbackId](),
  };
  if (!commands[data.command]) {
    console.log(`unknown command ${data.command}`);
    return;
  }
  commands[data.command]();
};
