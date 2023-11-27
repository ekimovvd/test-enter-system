import { getId } from "@/utils/uuid-helper";

export class CallIdService {
  private state = {
    loginId: getId(),
  };

  public uploadLoginId(): void {
    this.state.loginId = getId();
  }

  public getLoginId(): string {
    return this.state.loginId;
  }
}
