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
        :is-load-more="isLoadMore"
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

import {
  WebSocketService,
  LogsService,
  LevelsService,
  HighlightService,
  MessageParserService,
  CallIdService,
  AuthService,
} from "@/services";

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

    const logsService = new LogsService();
    const callIdService = new CallIdService();
    const authService = new AuthService(webSocketService, callIdService);

    const levelsService = reactive(new LevelsService());
    const highlightService = reactive(new HighlightService());

    const messageParserService = new MessageParserService(
      webSocketService,
      logsService,
      callIdService,
      authService
    );

    onUnmounted(() => {
      if (webSocketService) {
        webSocketService.close();
      }
    });

    const onReconnect = () => {
      webSocketService.connect(messageParserService.parseMessage, onReconnect);
    };

    webSocketService.connect(messageParserService.parseMessage, onReconnect);

    const displayedLogs = computed(() => {
      return logsService.getLogs(
        displayedLevels.value,
        highlightService.getIndex()
      );
    });

    const displayedLevels = computed(() => {
      return levelsService.getLevels();
    });

    const displayedSearch = computed(() => {
      return logsService.getSearch();
    });

    const displayedTotalCount = computed(() => {
      return logsService.getTotalCountLogs();
    });

    const isLoadMore = computed(() => {
      return logsService.isLoadMore();
    });

    const changeSearch = (search: string) => {
      logsService.changeSearch(search);

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
      displayedSearch,
      displayedTotalCount,
      isLoadMore,
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
