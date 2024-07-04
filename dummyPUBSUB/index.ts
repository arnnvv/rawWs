import PubSubManager from "./PubSubmanager";

setInterval(() => {
  PubSubManager.getInstance().subscribe(Math.random().toString(), "TATA");
}, 5000);
