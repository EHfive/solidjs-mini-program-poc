import {
  incrementId,
  mpNodeTreeToData,
  shortcutAttr,
  componentAlias,
} from "./utils.js";

const nodeId = incrementId();

interface MpPageInstance {
  setData(data: unknown): void;
  [k: string]: any;
}

export enum MpNodeType {
  ELEMENT_NODE = 1,
  // ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  // CDATA_SECTION_NODE = 4,
  // ENTITY_REFERENCE_NODE = 5,
  COMMENT_NODE = 6,
  // PROCESSING_INSTRUCTION_NODE = 7,
  DOCUMENT_NODE = 9,
}

export interface MpEvent {
  type: string;
  timeStamp: number;
  target: MpNode;
  currentTarget: MpNode;
  detail?: any;
}

export interface MpEventListener {
  (event: MpEvent): void;
}

export class MpEventTarget {
  private listenerSets: Record<string, Set<MpEventListener> | undefined> = {};
  protected constructor() {}

  addEventListener(type: string, listener: MpEventListener) {
    const listenerSet =
      this.listenerSets[type] || (this.listenerSets[type] = new Set());
    listenerSet.add(listener);
  }
  removeEventListener(type: string, listener: MpEventListener) {
    this.listenerSets[type]?.delete(listener);
  }
  dispatchEvent(event: MpEvent) {
    this.listenerSets[event.type]?.forEach((f) => f(event));
  }
}

interface MpUpdatePayload {
  path: string;
  value: any;
}

export class MpNode extends MpEventTarget {
  readonly nodeType: MpNodeType = undefined!;
  readonly nodeName: string = undefined!;
  readonly sid: string;

  private _parentNode: MpNode | null = null;
  private _childNodes: MpNode[] = [];

  protected constructor() {
    super();
    this.sid = "_" + nodeId();
  }

  protected get path(): string {
    const parentNode = this._parentNode;
    if (!parentNode) return "";
    const index = parentNode.findChildIndex(this);
    return `${parentNode.path}.cn[${index}]`;
  }

  getNodeBySid(sid: string): MpNode | null {
    if (sid === this.sid) {
      return this;
    }
    // XXX: expensive operation, maintain a global lookup table instead
    for (const child of this._childNodes) {
      const childNode = child.getNodeBySid(sid);
      if (childNode) {
        return childNode;
      }
    }
    return null;
  }

  get childNodes(): MpNode[] {
    return [...this._childNodes];
  }

  get parentNode(): MpNode | null {
    return this._parentNode;
  }

  get root(): MpRootElement | null {
    return this.parentNode?.root || null;
  }

  get firstChild(): MpNode | null {
    return this._childNodes[0] || null;
  }

  get nextSibling(): MpNode | null {
    const parent = this.parentNode;
    return parent?.childNodes[parent.findChildIndex(this) + 1] || null;
  }

  protected setParent(parent: MpNode | null) {
    this._parentNode = parent;
  }

  protected findChildIndex(child: MpNode): number {
    const index = this.childNodes.indexOf(child);
    if (index === -1) {
      throw new Error("not a child of this node");
    }
    return index;
  }

  private updateChildNodes(isClean?: boolean) {
    this.enqueueUpdate({
      path: `${this.path}.cn`,
      value: isClean ? [] : this._childNodes.map(mpNodeTreeToData),
    });
  }

  insertBefore(newNode: MpNode, refNode?: MpNode | null): MpNode {
    newNode.parentNode?.removeChild(newNode);

    if (refNode) {
      const index = this.findChildIndex(refNode);
      this._childNodes.splice(index, 0, newNode);
    } else {
      this._childNodes.push(newNode);
    }
    newNode.setParent(this);

    if (this.path) {
      if (this._childNodes.length > 1) {
        this.enqueueUpdate({
          path: newNode.path,
          value: mpNodeTreeToData(newNode),
        });
      } else {
        this.updateChildNodes();
      }
    }

    return newNode;
  }

  removeChild(child: MpNode): MpNode {
    const index = this.findChildIndex(child);
    this._childNodes.splice(index, 1);
    child.setParent(null);

    this.updateChildNodes();

    return child;
  }

  protected enqueueUpdate(payload: MpUpdatePayload) {
    (this.root as MpNode | null)?.enqueueUpdate(payload);
  }

  _logTree(level = 0) {
    const isText = this.nodeType === MpNodeType.TEXT_NODE;
    const ident = Array(level * 3).join(" ");
    const tag = this.nodeName.toLowerCase();
    const nodeLine = isText
      ? `#text ${JSON.stringify((this as unknown as MpText).data)}`
      : `<${tag}>`;
    console.log(ident + nodeLine);

    for (const child of this._childNodes) {
      child._logTree(level + 1);
    }
    if (!isText) {
      console.log(ident + `</${tag}>`);
    }
  }
}

export class MpText extends MpNode {
  readonly nodeType = MpNodeType.TEXT_NODE;
  readonly nodeName = "#text";
  private _data: string;
  private constructor(_data: string) {
    super();
    this._data = _data;
  }

  set data(value: string) {
    this._data = value;
    this.enqueueUpdate({
      path: `${this.path}.v`,
      value,
    });
  }

  get data(): string {
    return this._data;
  }

  static _create(_data: string): MpText {
    return new MpText(_data);
  }
}

export class MpElement extends MpNode {
  readonly nodeType = MpNodeType.ELEMENT_NODE;
  readonly tagName: string;
  readonly nodeName: string;

  attrs: Record<string, any> = {};

  protected constructor(tagName: string) {
    super();
    this.tagName = tagName.toUpperCase().replace(/^MP-/g, "");
    this.nodeName = this.tagName;
  }

  setAttribute(name: string, value: unknown) {
    // TODO: handling of dataset
    this.attrs[name] = value;

    const path = this.path;
    const attrAlias = componentAlias[this.nodeName.toLocaleLowerCase()];
    const attrPath = attrAlias?.[name] || shortcutAttr(name);
    this.enqueueUpdate({
      path: `${path}.${attrPath}`,
      value,
    });
  }

  static _create(tagName: string): MpElement {
    return new MpElement(tagName);
  }
}

export class MpRootElement extends MpElement {
  _page: MpPageInstance | null = null;
  private updates: MpUpdatePayload[] = [];
  private updating = false;
  protected constructor() {
    super("root");
  }

  get path(): string {
    return "root";
  }

  get root(): MpRootElement {
    return this;
  }

  protected enqueueUpdate(payload: MpUpdatePayload) {
    this.updates.push(payload);
    this._flushUpdates();
  }

  _flushUpdates() {
    if (!this._page || this.updating) {
      return;
    }
    // batch updates
    this.updating = true;
    queueMicrotask(() => {
      const data: Record<string, any> = {};
      while (this.updates.length > 0) {
        const { path, value } = this.updates.shift()!;
        data[path] = value;
      }
      console.log("flushing", data);
      this._page?.setData(data);
      this.updating = false;
    });
  }

  static _create(): MpRootElement {
    return new MpRootElement();
  }
}

export class MpDom extends MpNode {
  readonly nodeType = MpNodeType.DOCUMENT_NODE;
  readonly nodeName = "#document";
  protected constructor() {
    super();
  }

  get root(): null {
    return null;
  }

  createElement(tagName: "root"): MpRootElement;
  createElement(tagName: string): MpElement;
  createElement(tagName: string): MpRootElement | MpElement {
    if (tagName === "root") {
      return MpRootElement._create();
    }
    return MpElement._create(tagName);
  }

  createTextNode(data: string): MpText {
    const text = MpText._create(data);
    return text;
  }

  static _create(): MpDom {
    return new MpDom();
  }
}
