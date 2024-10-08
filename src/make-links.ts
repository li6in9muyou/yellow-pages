import { matchAndReplace, renderJsTemplateString } from "./utils";
import { TemplateType } from "./template-types";

export type LinkRenderer = (ctx: { input: string }) => string | null;

export default function (template: TemplateType): LinkRenderer {
  if (typeof template === "string") {
    return (ctx) => renderJsTemplateString(template, ctx);
  } else if (typeof template.predicate === "string") {
    return (ctx) => {
      const predicateIsTrue =
        null !== ctx.input.match(new RegExp(template.predicate));
      if (!predicateIsTrue) {
        return null;
      }

      if ("" === template.match || undefined === template.match) {
        return template.replace;
      }

      return matchAndReplace(ctx.input, template.match, template.replace);
    };
  }
  return () => null;
}
