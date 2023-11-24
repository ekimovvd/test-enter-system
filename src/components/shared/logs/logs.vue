<template>
  <div class="shared-logs">
    <div class="shared-logs__log" v-for="(log, logIndex) in logs" :key="log">
      <h4
        v-html="highlightText(log.Level, logIndex)"
        class="shared-logs__log-level"
        :class="onDisplayedLogLevelClass(log.Level)"
      ></h4>

      <p
        class="shared-logs__log-message"
        v-html="highlightText(log.Message, logIndex)"
      ></p>

      <div class="shared-logs__log-footer">
        <p
          v-if="log.Source"
          class="shared-logs__log-label shared-logs__log-label--source"
          v-html="highlightText(log.Source, logIndex)"
        ></p>

        <span
          class="shared-logs__log-label shared-logs__log-label--timestamp"
          v-html="highlightText(log.Timestamp, logIndex)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

import { LogItem } from "@/shared/repo";
import { HighlightService } from "@/services/HighlightService";

export default defineComponent({
  name: "SharedLogs",
  props: {
    logs: {
      type: Array as () => LogItem[],
      default: () => [],
    },
    search: {
      type: String,
      default: "",
    },
    highlightService: {
      type: Object as () => HighlightService,
      required: true,
    },
  },
  setup(props) {
    const { search, highlightService } = toRefs(props);

    const onDisplayedLogLevelClass = (level: string) => {
      return `shared-logs__log-level--${level.toLowerCase()}`;
    };

    const highlightText = (text: string, index: number) => {
      return highlightService.value.getHighlightText(
        text,
        index,
        search.value,
        "shared-logs__log-highlight"
      );
    };

    return {
      onDisplayedLogLevelClass,
      highlightText,
    };
  },
});
</script>

<style lang="scss">
.shared-logs {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;

  &__log {
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #f5f5f5;
  }

  &__log-level {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 8px;

    &--warn {
      color: #6e6e6e;
    }

    &--error {
      color: #ba403c;
    }

    &--debug {
      color: #3465be;
    }

    &--info {
      color: #258052;
    }

    &--trace {
      color: #b88623;
    }
  }

  &__log-message {
    font-size: 12px;
    line-height: 16px;
    color: #999999;
    margin-bottom: 12px;
    word-break: break-word;
  }

  &__log-footer {
    display: flex;
    align-items: center;
    column-gap: 12px;
  }

  &__log-label {
    font-size: 10px;
    line-height: 14px;
    padding: 4px 8px;
    border-radius: 4px;

    &--source {
      color: #3465be;
      background: #dce5f5;
    }

    &--timestamp {
      color: #258052;
      background: #d8e9e1;
    }
  }

  &__log-highlight {
    color: #ba403c;
    background: #f3dbd8;
  }
}
</style>
