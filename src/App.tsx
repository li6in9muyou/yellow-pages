import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
import TEMPLATES from "./url-templates.json";
import makeLinks from "./make-links";

function Link(props: { url: string }) {
  return (
    <a href={props.url} target="_blank">
      {props.url}
    </a>
  );
}

function App() {
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
    console.log("e.target.value", e.target.value);
    setTemplateInput(e.target.value);
  }

  const ctx = { input: templateInput };
  const links = TEMPLATES.map((template) => makeLinks(template)(ctx));

  return (
    <>
      <h1>yellow pages</h1>
      <input
        type="text"
        value={templateInput}
        onChange={handleTemplateInputChange}
      />
      <main>{links.map((link) => link && <Link key={link} url={link} />)}</main>
    </>
  );
}

export default App;
