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
  match: string,
  replace: string,
): string {
  const pattern = new RegExp(match);
  const groups = text.match(pattern);
  if (groups === null) {
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
