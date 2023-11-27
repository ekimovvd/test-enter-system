<template>
  <div class="shared-scroll-wrapper" ref="scrollWrapper">
    <slot></slot>

    <div ref="sentinelElement" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, toRefs } from "vue";

import { createIntersectionObserver } from "@/utils/scroll";

const INITIAL_LIMIT = 10;
const INITIAL_OFFSET = 0;

export default defineComponent({
  name: "SharedScrollWrapper",
  props: {
    isLoadMore: {
      type: Boolean,
      default: false,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ["load-more"],
  setup(props, { emit }) {
    const { isLoadMore, totalCount } = toRefs(props);

    const scrollWrapper = ref<HTMLElement | null>(null);
    const sentinelElement = ref<HTMLElement | null>(null);

    const observerOptions = {
      root: scrollWrapper.value,
      rootMargin: "0px",
      threshold: 1.0,
    };

    let offset = INITIAL_OFFSET;

    const observer = createIntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      if (isLoadMore.value) {
        const remainingItems = totalCount.value - offset;

        if (remainingItems <= 0 || totalCount.value <= INITIAL_LIMIT) return;

        offset += Math.min(INITIAL_LIMIT, remainingItems);

        loadMore();

        return;
      }

      offset += INITIAL_LIMIT;
    }, observerOptions);

    onMounted(() => {
      if (!sentinelElement.value) return;

      observer?.observe(sentinelElement.value);
    });

    onUnmounted(() => {
      observer?.disconnect();
    });

    const loadMore = () => {
      emit("load-more");
    };

    return {
      scrollWrapper,
      sentinelElement,
    };
  },
});
</script>

<style lang="scss">
.shared-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
