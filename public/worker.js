// TODO: Can the eval code be prevented from changing the callbacks list?

// structureMap keeps track of everything $w need to return from getters.
let itemsMap = {};
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
        postMessage({ command: "setOnClick", selector, callbackId });
      },

      set text(text) {
        item.data.text = text;
        postMessage({ command: "setData", selector, overrideData: { text } });
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

    Input: {
      get value() {
        return item.data.value;
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
    },
  };
  return properties[item.type];
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = async ({ data: message }) => {
  console.log("main to userCode", message);

  const commands = {
    init: () => {
      itemsMap = message.itemsMap;

      fetch(message.codeUrl)
        .then((response) => response.text())
        // eslint-disable-next-line no-eval
        .then((code) => eval(code))
        .then(() => postMessage({ command: "userCodeRan" }));
    },
    setData: () => {
      Object.assign(itemsMap[message.id].data, message.data);
    },
    callback: () => {
      callbacks[message.callbackId]();
    },
  };
  commands[message.command]();
};
