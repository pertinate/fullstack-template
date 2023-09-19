import { useEffect, useState } from "react";
import { Test } from "@types";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [texts, setTexts] = useState<Test[]>([]);
  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((res) => setTexts(res));
  }, []);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            fetch("/api/", {
              method: "POST",
              body: JSON.stringify({
                text: (Math.random() + 1).toString(36).substring(7),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then(() => {
              fetch("/api/")
                .then((res) => res.json())
                .then((res) => setTexts(res));
            });
          }}
        >
          count is {count}
        </button>
        {JSON.stringify(texts)}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
