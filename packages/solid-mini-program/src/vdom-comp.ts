import { createElement, spread } from "solid-mp-vdom-renderer";

// Skip automatic <svg/> wrapping of SVG tags (e.g. <view/>) by babel-preset-solid
// and JSX element type check, though this introduces overheads
function createMpComp(tagName: string): (props?: any) => any {
  return function (props?: any) {
    const el = createElement(tagName);
    spread(el, props);
    return el;
  };
}

export const View = createMpComp("view");
export const Text = createMpComp("text");
export const Button = createMpComp("button");
export const Navigator = createMpComp("navigator");
