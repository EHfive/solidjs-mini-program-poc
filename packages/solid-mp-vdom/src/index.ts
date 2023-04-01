import { MpDom } from "./vdom.js";

export * from "./vdom.js";

export { componentAlias, mpNodeTreeToData } from "./utils.js";

export const mpDom: MpDom = MpDom._create();

export default mpDom;
