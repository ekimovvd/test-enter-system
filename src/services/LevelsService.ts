import { reactive } from "vue";
import { debounce } from "lodash";

import { DEFAULT_DEBOUNCE } from "@/shared/constants";

export class LevelsService {
  private state = reactive({
    levels: [] as string[],
  });

  public add = reactive(
    debounce((level: string): void => {
      const hasLevel = this.state.levels.find(
        (findLevel) => findLevel === level
      );

      if (!hasLevel) {
        this.state.levels.push(level);
      }
    }, DEFAULT_DEBOUNCE)
  );

  public remove = reactive(
    debounce((level: string): void => {
      const levelIndex = this.state.levels.findIndex(
        (findLevel) => findLevel === level
      );

      if (levelIndex > -1) {
        this.state.levels.splice(levelIndex, 1);
      }
    }, DEFAULT_DEBOUNCE)
  );

  public get(): string[] {
    return this.state.levels;
  }
}
