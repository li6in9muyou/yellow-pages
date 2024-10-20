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

it("should treat empty match as no match", () => {
  expect(matchAndReplace("ab", "", "ddddd")).toBe("ab");
});

it("should support match and replace arrays that has same length", () => {
  expect(
    matchAndReplace("abc", ["a", "b", "c"], ["x", "y", "z"]),
  ).toStrictEqual(["xbc", "ayc", "abz"]);
});

it("should support single match (string) and many replaces", () => {
  expect(
    matchAndReplace("uuid-abcd", ".*", [
      "https://example.com/${0}/edit",
      "https://example.com/${0}/view",
    ]),
  ).toStrictEqual([
    "https://example.com/uuid-abcd/edit",
    "https://example.com/uuid-abcd/view",
  ]);
});

it("should return null if params are bad", () => {
  expect(matchAndReplace("abc", ["a", "b"], "a")).toBeNull();
  expect(matchAndReplace("abc", ["a", "b"], ["a", "b", "c"])).toBeNull();
});

it("should support single match (string[]) and many replaces", () => {
  expect(
    matchAndReplace(
      "uuid-abcd",
      [".*"],
      ["https://example.com/${0}/edit", "https://example.com/${0}/view"],
    ),
  ).toStrictEqual([
    "https://example.com/uuid-abcd/edit",
    "https://example.com/uuid-abcd/view",
  ]);
});
