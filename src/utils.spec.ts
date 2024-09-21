import { expect, it } from "vitest";
import { renderJsTemplateString } from "./utils";

it("should replace ${templateInput}", () => {
  expect(
    renderJsTemplateString("Hello ${templateInput}!", {
      templateInput: "world",
    }),
  ).toBe("Hello world!");
});

it("should treat undefined/null as empty strings", () => {
  expect(renderJsTemplateString("Hello ${templateInput}!", {})).toBe("Hello !");
});
