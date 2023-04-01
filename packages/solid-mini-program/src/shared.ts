import { mpDom } from "solid-mp-vdom";

export function eventHandler(e: WechatMiniprogram.CustomEvent) {
  // console.log("eventHandler", e);
  const currentNode = mpDom.getNodeBySid(e.currentTarget.dataset.sid);
  if (!currentNode) {
    return;
  }
  const targetNode = mpDom.getNodeBySid(e.target.dataset.sid);
  if (!targetNode) {
    return;
  }

  currentNode.dispatchEvent({
    ...e,
    target: targetNode,
    currentTarget: currentNode,
  });
}
