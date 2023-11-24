import { reactive } from "vue";
import { debounce } from "lodash";

import { LogItem } from "@/shared/repo";
import { DEFAULT_DEBOUNCE } from "@/shared/constants";

interface Logs {
  Action: number;
  Items: LogItem[];
}

const PAGE_SIZE = 10;

export class LogsService {
  private state = reactive({
    logs: [] as LogItem[],
    page: 0,
    search: "",
  });

  public addLogs(logs: Logs): void {
    this.state.logs.push(...logs.Items);
  }

  public setPage(page: number): void {
    this.state.page = page;
  }

  public addPage(): void {
    if (this.getFilteredLogs.length) {
      this.state.page++;
    }
  }

  public changeSearch = reactive(
    debounce((search: string): void => {
      this.state.search = search;
    }, DEFAULT_DEBOUNCE)
  );

  public getLogs(): LogItem[] {
    return this.state.logs;
  }

  public getFilteredLogs(selectedLevels: string[]): LogItem[] {
    let logs = this.state.logs;

    if (this.state.search) {
      logs = logs.filter((log) =>
        `${log.Level.toLowerCase()} ${log.Message.toLowerCase()} ${log.Source.toLowerCase()} ${log.Timestamp.toLowerCase()}`.includes(
          this.state.search.toLowerCase()
        )
      );
    }

    if (selectedLevels.length) {
      logs = logs.filter((log) => !selectedLevels.includes(log.Level));
    }

    const endIndex = (this.state.page + 1) * PAGE_SIZE;

    return logs.slice(0, endIndex);
  }

  public getSearch(): string {
    return this.state.search;
  }
}
