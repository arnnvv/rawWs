import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  FC,
  MutableRefObject,
} from "react";

const WSClient: FC = (): JSX.Element => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const webSocket: MutableRefObject<WebSocket | null> =
    useRef<WebSocket | null>(null);

  useEffect(() => {
    webSocket.current = new WebSocket("ws://localhost:8080");

    webSocket.current.onopen = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get("roomid");

      webSocket.current?.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        }),
      );
    };

    webSocket.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prevMessages: string[]): string[] => [
          ...prevMessages,
          JSON.stringify(data.payload),
        ]);
      }
    };

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (webSocket.current && message) {
      webSocket.current.send(
        JSON.stringify({
          type: "message",
          payload: {
            message,
          },
        }),
      );
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage}>send</button>
      <br />
      <br />
      <h2>Events from server</h2>
      <div id="serverMessages">
        {messages.map(
          (msg: string, index: number): JSX.Element => (
            <div key={index}>{msg}</div>
          ),
        )}
      </div>
    </div>
  );
};

export default WSClient;
