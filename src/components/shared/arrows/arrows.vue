<template>
  <div class="shared-arrows">
    <button
      class="shared-arrows__arrow"
      :disabled="isDisabledNext"
      @click="next"
    >
      <i class="bx bx-chevron-down"></i>
    </button>

    <button
      class="shared-arrows__arrow"
      :disabled="isDisabledPrevious"
      @click="previous"
    >
      <i class="bx bx-chevron-up"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

import { LogItem } from "@/shared/repo";
import { HighlightService } from "@/services/HighlightService";

export default defineComponent({
  name: "SharedArrows",
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
    const { search, highlightService, logs } = toRefs(props);

    const isDisabledPrevious = computed(() => {
      return !search.value || !displayedHighlightIndex.value;
    });

    const isDisabledNext = computed(() => {
      return (
        !search.value || displayedHighlightIndex.value >= highlightMatches.value
      );
    });

    const highlightMatches = computed(() => {
      return search.value ? logs.value.length : 0;
    });

    const displayedHighlightIndex = computed(() => {
      return highlightService.value.getIndex();
    });

    const previous = () => {
      if (displayedHighlightIndex.value) {
        highlightService.value.previousIndex();
      }
    };

    const next = () => {
      if (displayedHighlightIndex.value < highlightMatches.value) {
        highlightService.value.nextIndex();
      }
    };

    return {
      isDisabledPrevious,
      isDisabledNext,
      previous,
      next,
    };
  },
});
</script>

<style lang="scss">
.shared-arrows {
  display: flex;
  align-items: center;
  column-gap: 4px;

  &__arrow {
    background: none;
    border: none;
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 24px;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 0.5;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
}
</style>
