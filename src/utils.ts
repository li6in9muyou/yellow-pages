export function renderJsTemplateString(
  template: string,
  kv: { [key: string | number]: string },
): string {
  return template.replace(/\$\{\w+\}/g, (str: string) => {
    const key = str.slice(2, -1);
    return kv[key] ?? "";
  });
}
