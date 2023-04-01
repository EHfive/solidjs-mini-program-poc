import { createRenderer } from "solid-js/universal";
import { mpDom, MpNode, MpElement, MpNodeType, MpText } from "solid-mp-vdom";

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
} = createRenderer<MpNode>({
  createElement(tag) {
    return mpDom.createElement(tag);
  },
  createTextNode(value) {
    return mpDom.createTextNode(value);
  },
  replaceText(textNode, value) {
    (textNode as MpText).data = value;
  },
  setProperty(node, name, value, prev) {
    const el = node as MpElement;
    if (name === "ref") {
      (value as Function)(el);
    } else if (name.slice(0, 3) === "on:") {
      const e = name.slice(3);
      prev && el.removeEventListener(e, prev as any);
      value && node.addEventListener(e, value as any);
    } else if (name.slice(0, 10) === "oncapture:") {
      // XXX: unimplemented
    } else if (name.slice(0, 2) === "on") {
      const e = name.slice(2).toLowerCase();
      prev && el.removeEventListener(e, prev as any);
      value && node.addEventListener(e, value as any);
    } else {
      // TODO: handling of style, class, className, classList, textContent, .etc
      el.setAttribute(name, value);
    }
  },
  insertNode(parent, node, anchor) {
    parent.insertBefore(node, anchor);
  },
  isTextNode(node) {
    return node.nodeType === MpNodeType.TEXT_NODE;
  },
  removeNode(parent, node) {
    parent.removeChild(node);
  },
  getParentNode(node) {
    return node.parentNode!;
  },
  getFirstChild(node) {
    return node.firstChild!;
  },
  getNextSibling(node) {
    return node.nextSibling!;
  },
});

// Forward Solid control flow
export {
  For,
  Show,
  Suspense,
  SuspenseList,
  Switch,
  Match,
  Index,
  ErrorBoundary,
} from "solid-js";

// Forward VDOM singleton
export { mpDom };
