import { reactive } from "vue";

import { WebSocketService } from "./WebSocketService";

import { MessageType } from "@/shared/constants";
import { urlGenerator } from "@/utils/url-generator";
import { AuthFactory } from "@/shared/factory";
import { AuthParams } from "@/shared/repo";
import { CallIdService } from "./CallIdService";

export class AuthService {
  public state = reactive({
    auth: AuthFactory(),
  });
  private webSocketService: WebSocketService;
  private callIdService: CallIdService;

  constructor(
    webSocketService: WebSocketService,
    callIdService: CallIdService
  ) {
    this.webSocketService = webSocketService;
    this.callIdService = callIdService;
  }

  public login(callId: string): void {
    this.webSocketService.send([
      MessageType.Call,
      callId,
      urlGenerator().login(),
      process.env.VUE_APP_USERNAME,
      process.env.VUE_APP_PASSWORD,
    ]);
  }

  public loginByToken(): void {
    this.callIdService.uploadLoginId();

    this.webSocketService.send([
      MessageType.Call,
      this.callIdService.getLoginId(),
      urlGenerator().loginByToken(),
    ]);
  }

  public setAuth(auth: AuthParams): void {
    this.state.auth = AuthFactory(auth);
  }
}
