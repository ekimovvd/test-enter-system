import { reactive } from "vue";

export class HighlightService {
  private state = reactive({
    index: 0,
  });

  public setIndex(index: number): void {
    this.state.index = index;
  }

  public previousIndex(): void {
    this.state.index--;
  }

  public nextIndex(): void {
    this.state.index++;
  }

  public getIndex(): number {
    return this.state.index;
  }
}
