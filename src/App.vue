<template>
  <div class="app">
    <div class="app__container">
      <h1 class="app__title">
        Задание "Просмотр логов" <br />
        Екимов Вадим
      </h1>

      <div class="app__search">
        <UIInput
          placeholder="Поиск"
          :value="displayedSearch"
          @changed="changeSearch"
        />

        <SharedArrows
          :search="displayedSearch"
          :logs="displayedLogs"
          :highlight-service="highlightService"
        />
      </div>

      <SharedLevels
        class="app__levels"
        :selected-levels="displayedLevels"
        @level="selectLevel"
        @trash="trashLevel"
      />

      <SharedScrollWrapper
        :total-count="displayedTotalCount"
        @load-more="loadMore"
      >
        <SharedLogs
          :logs="displayedLogs"
          :search="displayedSearch"
          :highlight-service="highlightService"
        />
      </SharedScrollWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onUnmounted, reactive } from "vue";

import UIInput from "@/components/ui/input/input.vue";
import SharedLevels from "@/components/shared/levels/levels.vue";
import SharedLogs from "@/components/shared/logs/logs.vue";
import SharedArrows from "@/components/shared/arrows/arrows.vue";
import SharedScrollWrapper from "@/components/shared/scroll-wrapper/scroll-wrapper.vue";

import { WebSocketService } from "@/services/WebSocketService";
import { LogsService } from "@/services/LogsService";
import { LevelsService } from "@/services/LevelsService";
import { HighlightService } from "@/services/HighlightService";

import { MessageType } from "@/shared/constants";

export default defineComponent({
  name: "App",
  components: {
    UIInput,
    SharedLevels,
    SharedLogs,
    SharedArrows,
    SharedScrollWrapper,
  },
  setup() {
    const webSocketService = inject("$webSocketService") as WebSocketService;
    const logsService = reactive(new LogsService());
    const levelsService = reactive(new LevelsService());
    const highlightService = reactive(new HighlightService());

    onUnmounted(() => {
      if (webSocketService) {
        webSocketService.close();
      }
    });

    const onMessage = (event: MessageEvent) => {
      const [messageType, callId, result] = JSON.parse(event.data);

      switch (messageType) {
        case MessageType.Welcome:
          webSocketService.login(callId);

          break;
        case MessageType.CallResult:
          webSocketService.logs();

          break;
        case MessageType.Event:
          logsService.addLogs(result);

          break;
        default:
          break;
      }
    };

    const onReconnect = () => {
      webSocketService.connect(onMessage, onReconnect);
    };

    webSocketService.connect(onMessage, onReconnect);

    const displayedLogs = computed(() => {
      return logsService.getFilteredLogs(displayedLevels.value);
    });

    const displayedLevels = computed(() => {
      return levelsService.get();
    });

    const displayedTotalCount = computed(() => {
      return logsService.getLogs();
    });

    const displayedSearch = computed(() => {
      return logsService.getSearch();
    });

    const changeSearch = (search: string) => {
      logsService.changeSearch(search);
      logsService.setPage(0);

      highlightService.setIndex(0);
    };

    const selectLevel = (level: string) => {
      levelsService.add(level);
    };

    const trashLevel = (level: string) => {
      levelsService.remove(level);
    };

    const loadMore = () => {
      logsService.addPage();
    };

    return {
      highlightService,
      displayedLevels,
      displayedLogs,
      displayedTotalCount,
      displayedSearch,
      changeSearch,
      selectLevel,
      trashLevel,
      loadMore,
    };
  },
});
</script>

<style lang="scss">
.app {
  padding: 20px;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
  }

  &__title {
    font-weight: 500;
    font-size: 28px;
    line-height: 32px;
    text-align: center;
    margin-bottom: 24px;
  }

  &__search {
    display: flex;
    align-items: center;
    column-gap: 8px;
    margin-bottom: 12px;
    width: 100%;
  }

  &__levels {
    margin-bottom: 16px;
  }
}
</style>
