import { matchAndReplace, renderJsTemplateString } from "./utils";

export type TemplateType =
  | string
  | { predicate: string; match: string; replace: string };
export type LinkRenderer = (ctx: { input: string }) => string | null;

export default function (template: TemplateType): LinkRenderer {
  if (typeof template === "string") {
    return (ctx) => renderJsTemplateString(template, ctx);
  } else if (typeof template.predicate === "string") {
    return (ctx) => {
      const regex = new RegExp(template.predicate);
      const shouldApplyThisTemplate = null !== ctx.input.match(regex);
      if (shouldApplyThisTemplate) {
        return matchAndReplace(ctx.input, template.match, template.replace);
      } else {
        return null;
      }
    };
  }
  return () => null;
}
