import { JSX } from "solid-js";

declare module "solid-js" {
  declare namespace JSX {
    interface IntrinsicElements {
      "mp-view": any;
      "mp-text": any;
    }
  }
}
