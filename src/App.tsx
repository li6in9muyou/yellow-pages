import "./App.css";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { del, get, set } from "idb-keyval";
import Hotkeys from "react-hot-keys";
import { TemplateType } from "./template-types";
import makeLinks from "./make-links";

async function isPermissionGranted(
  fileHandle: FileSystemFileHandle,
  withWrite = false,
) {
  const opts: FileSystemHandlePermissionDescriptor = {};
  if (withWrite) {
    opts.mode = "readwrite";
  }

  if ((await fileHandle.queryPermission(opts)) === "granted") {
    return true;
  }

  if ((await fileHandle.requestPermission(opts)) === "granted") {
    return true;
  }

  return false;
}

async function handleReadingLocalFileRepeatedly(
  fileKey = "file",
  errorHandler: (error: string, payload: unknown) => void,
): Promise<string> {
  try {
    const cached = await get(fileKey);

    if (cached) {
      let file;
      try {
        file = await cached.getFile();
      } catch (error) {
        errorHandler("cached but no permission", error);
        await del(fileKey);
        return "";
      }

      const contents = await file.text();
      return contents;
    }

    let handle;
    try {
      [handle] = await window.showOpenFilePicker();
    } catch (error: unknown) {
      switch ((error as DOMException).name) {
        case "AbortError":
          errorHandler("newly select but aborted", error);
          break;
        default:
          throw error;
      }
    }
    await set(fileKey, handle);

    const granted = isPermissionGranted(handle!);
    if (!granted) {
      errorHandler("newly selected but no permission", handle);
    }

    const file = await handle!.getFile();
    const contents = await file.text();
    return contents;
  } catch (error: unknown) {
    errorHandler("unknown error", error);
    return "";
  }
}

function Link(props: { url: string }) {
  return (
    <a href={props.url} target="_blank">
      {props.url}
    </a>
  );
}

const handleLoadYellowPages = async (
  setTemplates: (templates: TemplateType[]) => void,
) => {
  const json = await handleReadingLocalFileRepeatedly(
    "yellow-pages--templates",
    (error: unknown) => {
      console.error("handleReadingLocalFileRepeatedly error", error);
    },
  );
  return setTemplates(JSON.parse(json));
};

function App() {
  const [TEMPLATES, setTEMPLATES] = useState<TemplateType[]>([]);
  const handleImport = useCallback(
    () => handleLoadYellowPages(setTEMPLATES),
    [setTEMPLATES],
  );
  const [templateInput, setTemplateInput] = useState("");

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then(setTemplateInput)
      .catch((err) =>
        console.error("error while request clipboard content", err),
      );
  }, []);

  function handleTemplateInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTemplateInput(e.target.value);
  }

  const ctx = { input: templateInput };
  const links = TEMPLATES.map((template) => makeLinks(template)(ctx)).flat();

  function handleEnter() {
    console.log("libq handle enter");
    try {
      const validLink = new URL(links.filter(Boolean)[0] ?? "");
      window.location.href = validLink.toString();
    } catch (e) {
      console.error("error when jumping to link", e, links);
    }
  }

  return (
    <>
      <Hotkeys keyName="enter" onKeyUp={handleEnter}>
        <h1>yellow pages</h1>
        <section>click anywhere below to import yellow pages</section>
        <main onClick={handleImport}>
          <input
            type="text"
            value={templateInput}
            onChange={handleTemplateInputChange}
          />
          <section className="links">
            {links.map((link) => link && <Link key={link} url={link} />)}
          </section>
        </main>
      </Hotkeys>
    </>
  );
}

export default App;
