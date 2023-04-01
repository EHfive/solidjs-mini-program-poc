// @ts-check

// modified from postcss-html-transform

const tags2Rgx = (tags) =>
  new RegExp(
    `(^| |\\+|,|~|>|\\n)(${tags.join("|")})\\b(?=$| |\\.|\\+|,|~|:|\\[)`,
    "g"
  );

/** @type {import('postcss').PluginCreator} */
const PostcssHtmlTransform = () => {
  const selector = tags2Rgx(htmlTags);
  const walkRules = (rule) => {
    if (/(^| )\*(?![=/*])/.test(rule.selector)) {
      rule.remove();
      return;
    }
    rule.selector = rule.selector
      .replace(/:focus/g, ".is-focused")
      .replace(/:hover/g, ".is-hovered");
    rule.selector = rule.selector.replace(selector, "$1.h5-$2");
  };
  return {
    postcssPlugin: "postcss-weapp",
    Rule(rule) {
      if (typeof walkRules === "function") {
        walkRules(rule);
      }
    },
    Declaration(decl) {
      // `cursor: pointer` would cause weapp framework to render a transparent blue overlay
      // on top of the hovered element, remove to workaround
      if (decl.prop === "cursor") {
        decl.remove();
      }
    },
  };
};
PostcssHtmlTransform.postcss = true;

export default PostcssHtmlTransform;

const htmlTags = [
  "html",
  "body",
  "a",
  "audio",
  "button",
  "canvas",
  "form",
  "iframe",
  "img",
  "input",
  "label",
  "progress",
  "select",
  "slot",
  "textarea",
  "video",
  "abbr",
  "area",
  "b",
  "bdi",
  "big",
  "br",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "i",
  "ins",
  "kbd",
  "map",
  "mark",
  "meter",
  "output",
  "picture",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "td",
  "template",
  "th",
  "time",
  "tt",
  "u",
  "var",
  "wbr",
  "address",
  "article",
  "aside",
  "blockquote",
  "caption",
  "dd",
  "details",
  "dialog",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "legend",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "summary",
  "table",
  "tbody",
  "tfoot",
  "thead",
  "tr",
  "ul",
  "svg",
];
