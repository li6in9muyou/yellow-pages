import { isArray, zip } from "lodash";

export function renderJsTemplateString(
  template: string,
  kv: { [key: string | number]: string },
): string {
  return template.replace(/\$\{\w+\}/g, (str: string) => {
    const key = str.slice(2, -1);
    return kv[key] ?? "";
  });
}

export function matchAndReplace(
  text: string,
  match: string | string[],
  replace: string | string[],
): string | string[] | null {
  if (isArray(replace)) {
    return matchAndReplaceArray(text, match, replace);
  }

  if (!isArray(match) && !isArray(replace)) {
    return matchAndReplaceSimple(text, match, replace);
  }

  console.error("matchAndReplace: param error", text, match, replace);
  return null;
}

function matchAndReplaceSimple(
  text: string,
  match: string,
  replace: string,
): string {
  const pattern = new RegExp(match);
  const groups = text.match(pattern);

  const noMatch = groups === null || match === "";
  if (noMatch) {
    return text;
  }

  const ctxCapturingGroups: { [key: string | number]: string } = {};
  for (let i = 0; i < groups.length; i++) {
    ctxCapturingGroups[i.toString()] = groups[i];
  }
  const replaceVerbatim = text.replace(pattern, replace);
  const replaceCapturingGroup = renderJsTemplateString(
    replaceVerbatim,
    ctxCapturingGroups,
  );
  return replaceCapturingGroup;
}

function matchAndReplaceArray(
  text: string,
  match: string | string[],
  replace: string[],
): string[] | null {
  match = [match].flat();

  const singleMatchManyReplace = match.length === 1 && replace.length > 1;
  if (singleMatchManyReplace) {
    const paddedMatch = new Array(replace.length).fill(match[0]);
    return zip(paddedMatch, replace).reduce(
      (replaced, [m, r]) => [...replaced, matchAndReplaceSimple(text, m!, r!)],
      [] as string[],
    );
  }

  if (match.length === replace.length) {
    return zip(match, replace).reduce(
      (replaced, [m, r]) => [...replaced, matchAndReplaceSimple(text, m!, r!)],
      [] as string[],
    );
  }

  return null;
}
