import { JSXElement } from "solid-js";
import { template, spread } from "solid-js/web";

function createTaroComp(tagName: string) {
  // returns cloneable node then,
  // returns node factory after solid-js 1.7.0
  const tmpl = template(
    `<${tagName}></${tagName}>`,
    /** Custom Element */ true // if false use document.importNode(), which is not implemented in Taro runtime
  );
  return function (props?: any) {
    const el = tmpl() as Element;
    // XXX: rename "onEvent" to "on:event" to skip event delegation, note property value could be a getter
    props && spread(el, props);
    return el as JSXElement;
  };
}
export const View = createTaroComp("view");
export const Text = createTaroComp("text");
export const Input = createTaroComp("input");
