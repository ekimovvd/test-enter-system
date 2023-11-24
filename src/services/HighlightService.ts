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

  public getHighlightText = (
    text: string,
    highlightIndex: number,
    search: string | null,
    activeClass: string
  ) => {
    if (!search || !text) {
      return text;
    }

    const highlightActiveClass =
      highlightIndex === this.state.index ? activeClass : "";

    return text
      .replace(/<br ?\/?>/g, "\n")
      .replace(
        new RegExp(search, "gi"),
        (match) =>
          `<span class="${highlightActiveClass}" data-log-index="${this.state.index}">${match}</span>`
      );
  };

  public getIndex(): number {
    return this.state.index;
  }
}
