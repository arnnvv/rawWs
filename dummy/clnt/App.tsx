import React, { ChangeEvent, useEffect, useState } from "react";
function App(): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("connected");
      newSocket.send("hello Server");
    };

    newSocket.onmessage = (event) => {
      console.log(event.data);
    };
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);
  if (!socket) return <>Connecting...</>;

  return (
    <>
      <input
        placeholder="message"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setMessage(event.target.value)
        }
      />
      <button onClick={() => socket.send(message)}>SEND</button>
    </>
  );
}

export default App;
