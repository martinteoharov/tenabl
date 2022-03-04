import { fold } from "fp-ts/lib/Either";
import React from "react";
import "./App.css";
import { greet } from "./common/greet";
import { Message, MessageList } from "./common/message";
import logo from "./logo.svg";

const App = () => {
  const [msgs, setMsgs] = React.useState<Message[]>([]);

  React.useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((json) => MessageList.decode(json))
      .then(
        fold(
          () => setMsgs([{ name: "PARSER", post: "Failed to parse response" }]),
          (m) => setMsgs(m)
        )
      );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          <br />
          {greet("World")}
          <br />
          Use a REST client to post messages for now.
        </p>
        {msgs.length ? (
          <>
            <h4>Messages</h4>
            <dl>
              {msgs.map(({ name, post }) => (
                <>
                  <dt>{name}</dt>
                  <dd>{post}</dd>
                </>
              ))}
            </dl>
          </>
        ) : null}
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
