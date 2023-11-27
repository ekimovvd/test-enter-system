import { urlGenerator } from "@/utils/url-generator";
import { MessageType } from "@/shared/constants";

const DEFAULT_PING_INTERVAL = 30000;

type WebSocketCallbackMessage = (event: MessageEvent) => void;
type WebSocketCallbackReconnect = () => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private counter = 0;
  private callbackMessage: WebSocketCallbackMessage | null = null;
  private callbackReconnect: WebSocketCallbackReconnect | null = null;

  public connect(
    callbackMessage: WebSocketCallbackMessage,
    callbackReconnect: WebSocketCallbackReconnect
  ): void {
    this.socket = new WebSocket(process.env.VUE_APP_WEB_SOCKET_URL);

    this.callbackMessage = callbackMessage;
    this.callbackReconnect = callbackReconnect;

    this.socket.onopen = () => {
      setInterval(() => {
        this.heartbeat();
      }, DEFAULT_PING_INTERVAL);
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.counter = 0;

      if (this.callbackReconnect) {
        this.callbackReconnect();
      }
    };

    this.socket.onerror = (event) => {
      console.log("Error: ", event);
    };

    this.socket.onmessage = (event) => {
      if (this.callbackMessage) {
        this.callbackMessage(event);
      }
    };
  }

  public logs(): void {
    this.send([MessageType.Subscribe, urlGenerator().list()]);
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  private heartbeat(): void {
    this.send([MessageType.Heartbeat, this.counter]);

    this.counter++;
  }

  public send(
    payload: [MessageType, string | number, string?, string?, string?]
  ): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(payload));
    }
  }
}
