import { MessageType } from "@/shared/constants";

import { LogsService, WebSocketService, CallIdService } from "@/services";
import { AuthService } from "./AuthService";

enum Uri {
  logs = "http://enter.local/subscription/logs/list",
}

export class MessageParserService {
  private webSocketService: WebSocketService;
  private logsService: LogsService;
  private callIdService: CallIdService;
  private authService: AuthService;

  constructor(
    webSocketService: WebSocketService,
    logsService: LogsService,
    callIdService: CallIdService,
    authService: AuthService
  ) {
    this.webSocketService = webSocketService;
    this.logsService = logsService;
    this.callIdService = callIdService;
    this.authService = authService;
  }

  public parseMessage = (event: MessageEvent) => {
    const [messageType, payload, result] = JSON.parse(event.data);

    switch (messageType) {
      case MessageType.Welcome:
        this.authService.login(this.callIdService.getLoginId());

        break;
      case MessageType.CallResult:
        this.login(payload, result);

        break;
      case MessageType.CallError:
        this.login(payload, result);

        break;
      case MessageType.Event:
        if (result.SubscribeError) {
          this.webSocketService.logs();
        } else {
          if (payload === Uri.logs) {
            this.logsService.parseLogs(result);
          }
        }

        break;
      default:
        break;
    }
  };

  private login(payload: string, result: string): void {
    if (this.isLogin(payload)) {
      this.authService.login(result);

      this.webSocketService.logs();
    }
  }

  private isLogin(payload: string): boolean {
    return this.callIdService.getLoginId() === payload;
  }
}
