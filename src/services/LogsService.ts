import { reactive } from "vue";
import { debounce } from "lodash";

import { LogItem, LogItemResponse, MarkedText } from "@/shared/repo";
import { DEFAULT_DEBOUNCE } from "@/shared/constants";
import { getId } from "@/utils/uuid-helper";
import { MarkedTextFactory } from "@/shared/factory";
import { getMarkedText } from "@/utils/marked-helper";

interface Logs {
  Action: number;
  Items: LogItemResponse[];
}

enum Action {
  Adding = 0,
  Initialization = 3,
}

const PAGE_SIZE = 10;

export class LogsService {
  private state = reactive({
    logs: [] as LogItemResponse[],
    page: 0,
    search: "",
  });

  public parseLogs(logs: Logs): void {
    switch (logs.Action) {
      case Action.Adding:
        this.addLogs(logs.Items);

        break;
      case Action.Initialization:
        this.clearLogs();
        this.addLogs(logs.Items);

        break;
      default:
        break;
    }
  }

  public clearLogs(): void {
    this.state.logs = [];
    this.state.page = 0;
    this.state.search = "";
  }

  public addLogs(logs: LogItemResponse[]): void {
    this.state.logs.push(...logs);
  }

  public setPage(page: number): void {
    this.state.page = page;
  }

  public addPage(): void {
    if (this.getLogs.length) {
      this.state.page++;
    }
  }

  public changeSearch = reactive(
    debounce((search: string): void => {
      this.state.search = search;
    }, DEFAULT_DEBOUNCE)
  );

  public getLogs(selectedLevels: string[], highlightIndex: number): LogItem[] {
    const search = this.getSearch().toLowerCase();

    return this.state.logs
      .slice(0, (this.state.page + 1) * PAGE_SIZE)
      .filter((log) => {
        const hasSearchLog =
          `${log.Timestamp} ${log.Level} ${log.Message} ${log.Source}`
            .toLowerCase()
            .includes(search);

        if (!hasSearchLog) {
          return null;
        }

        const hasLevelLog = !selectedLevels.includes(log.Level);

        if (!hasLevelLog) {
          return null;
        }

        return log;
      })
      .map((log, logIndex) => {
        const isMarkedText = Boolean(search && logIndex === highlightIndex);

        return {
          Id: getId(),
          Level: this.markedText(log.Level, search, isMarkedText),
          Timestamp: this.markedText(log.Timestamp, search, isMarkedText),
          Source: this.markedText(log.Source, search, isMarkedText),
          Message: this.markedText(log.Message, search, isMarkedText),
        };
      });
  }

  public getSearch(): string {
    return this.state.search;
  }

  public getPage(): number {
    return this.state.page;
  }

  public getTotalCountLogs(): number {
    return this.state.logs.length;
  }

  public isLoadMore(): boolean {
    return (
      !this.getSearch() &&
      this.getPage() < Math.ceil(this.getTotalCountLogs() / PAGE_SIZE)
    );
  }

  private markedText(
    text: string,
    search: string,
    isMarkedText: boolean
  ): MarkedText[] {
    if (isMarkedText) {
      return getMarkedText(text, search);
    }

    return [MarkedTextFactory({ text })];
  }
}
