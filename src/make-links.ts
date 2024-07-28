import { renderJsTemplateString } from "./utils";

export type TemplateType = string | { match: string; target: string };
export type LinkRenderer = (ctx: { input: string }) => string | null;

export default function (template: TemplateType): LinkRenderer {
  if (typeof template === "string") {
    return (ctx) => renderJsTemplateString(template, ctx);
  } else if (typeof template.match === "string") {
    return (ctx) => {
      const match = ctx.input.match(template.match);
      if (match === null) {
        return null;
      } else {
        return renderJsTemplateString(template.target, match);
      }
    };
  }
  return () => null;
}
