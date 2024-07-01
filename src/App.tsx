import { ChangeEvent, useState } from "react";
import "./App.css";
import TEMPLATES from "./url-templates.json";
import { renderJsTemplateString } from "./utils";

function Link(props: { url: string }) {
  return (
    <a href={props.url} target="_blank">
      {props.url}
    </a>
  );
}

function App() {
  const [templateInput, setTemplateInput] = useState("");

  function handleTemplateInputChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("e.target.value", e.target.value);
    setTemplateInput(e.target.value);
  }

  const links = TEMPLATES.map((template) =>
    renderJsTemplateString(template, { templateInput: templateInput }),
  );

  return (
    <>
      <h1>sanity check</h1>
      <input
        type="text"
        value={templateInput}
        onChange={handleTemplateInputChange}
      />
      <main>
        {links.map((link) => (
          <Link key={link} url={link} />
        ))}
      </main>
    </>
  );
}

export default App;
