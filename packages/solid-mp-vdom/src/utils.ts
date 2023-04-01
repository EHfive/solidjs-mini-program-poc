import { MpNode, MpNodeType, MpText, MpElement } from "./vdom.js";
import componentAlias from "./alias.js";

export { componentAlias };

export function shortcutAttr(name: string): string {
  switch (name) {
    case "style":
      return "st";
    case "class":
      return "cl";
    default:
      return name;
  }
}

// copied from @tarojs/runtime
export function incrementId() {
  const chatCodes: number[] = [];
  // A-Z
  for (let i = 65; i <= 90; i++) {
    chatCodes.push(i);
  }
  // a-z
  for (let i = 97; i <= 122; i++) {
    chatCodes.push(i);
  }
  const chatCodesLen = chatCodes.length - 1;
  const list = [0, 0];
  return () => {
    const target = list.map((item) => chatCodes[item]);
    const res = String.fromCharCode(...target);

    let tailIdx = list.length - 1;

    list[tailIdx]++;

    while (list[tailIdx] > chatCodesLen) {
      list[tailIdx] = 0;
      tailIdx = tailIdx - 1;
      if (tailIdx < 0) {
        list.push(0);
        break;
      }
      list[tailIdx]++;
    }

    return res;
  };
}

export function mpNodeTreeToData(node: MpNode): any {
  const nodeName = node.nodeName.toLowerCase();
  const mapping = componentAlias[nodeName];
  if (node.nodeType === MpNodeType.TEXT_NODE) {
    const text = node as MpText;
    return {
      nn: mapping!._num,
      v: text.data,
    };
  }

  let attrs: Record<string, any> = {};
  if (node.nodeType === MpNodeType.ELEMENT_NODE && mapping) {
    const el = node as MpElement;
    if (el.attrs["class"]) {
      attrs["cl"] = el.attrs["class"];
    }
    if (el.attrs["style"]) {
      attrs["st"] = el.attrs["style"];
    }
    for (const key in mapping) {
      if (key === "_num" || el.attrs[key] === undefined) continue;
      const k = mapping[key] || key;
      attrs[k] = el.attrs[key];
    }
  }

  return {
    sid: node.sid,
    nn: mapping?._num || nodeName,
    cn: node.childNodes.map(mpNodeTreeToData),
    ...attrs,
  };
}
