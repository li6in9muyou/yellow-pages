import { expect, it } from "vitest";
import { matchAndReplace, renderJsTemplateString } from "./utils";

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

it("should replace verbatim", () => {
  expect(matchAndReplace("example.com/this/file", "this", "that")).toBe(
    "example.com/that/file",
  );
});

it("should support referenecing capturing group with ${\\d}", () => {
  expect(
    matchAndReplace(
      "example.com/this/file-1234.txt",
      "(\\w+)-(\\d+)",
      "${2}-${1}-${0}",
    ),
  ).toBe("example.com/this/1234-file-file-1234.txt");
});

it("should replace capturing group multiple times", () => {
  expect(
    matchAndReplace("dddd-1111", "(\\w+)-(\\d+)", "${2}-${1}-${1}-${1}"),
  ).toBe("1111-dddd-dddd-dddd");
});

it("should replace it with longer text", () => {
  expect(
    matchAndReplace(
      "dddd-1111",
      "(\\w+)-(\\d+)",
      "https://example.com/file/${0}",
    ),
  ).toBe("https://example.com/file/dddd-1111");
});
