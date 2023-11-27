<template>
  <div class="shared-logs">
    <div class="shared-logs__log" v-for="log in logs" :key="log.Id">
      <h4 class="shared-logs__log-level">
        <span v-for="part in log.Level" :key="part.id">
          <SharedHighlight v-if="part.isHighlight">
            {{ part.text }}
          </SharedHighlight>

          <span v-else>{{ part.text }}</span>
        </span>
      </h4>

      <p class="shared-logs__log-message">
        <span v-for="part in log.Message" :key="part.id">
          <SharedHighlight v-if="part.isHighlight">
            {{ part.text }}
          </SharedHighlight>

          <span v-else>{{ part.text }}</span>
        </span>
      </p>

      <div class="shared-logs__log-footer">
        <p class="shared-logs__log-label shared-logs__log-label--source">
          <span v-for="part in log.Source" :key="part.id">
            <SharedHighlight v-if="part.isHighlight">
              {{ part.text }}
            </SharedHighlight>

            <span v-else>{{ part.text }}</span>
          </span>
        </p>

        <p class="shared-logs__log-label shared-logs__log-label--timestamp">
          <span v-for="part in log.Timestamp" :key="part.id">
            <SharedHighlight v-if="part.isHighlight">
              {{ part.text }}
            </SharedHighlight>

            <span v-else>{{ part.text }}</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SharedHighlight from "@/components/shared/highlight/highlight.vue";

import { LogItem } from "@/shared/repo";

export default defineComponent({
  name: "SharedLogs",
  components: {
    SharedHighlight,
  },
  props: {
    logs: {
      type: Array as () => LogItem[],
      default: () => [],
    },
    search: {
      type: String,
      default: "",
    },
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
}
</style>
