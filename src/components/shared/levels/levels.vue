<template>
  <div class="shared-levels">
    <div
      class="shared-levels__level"
      v-for="level in displayedLevels"
      :key="level.id"
      :class="level.levelClass"
    >
      <button
        class="shared-levels__level-action"
        :class="level.levelActionClass"
        @click="selectLevel(level)"
      >
        {{ level.name }}
      </button>

      <div
        class="shared-levels__level-delimiter"
        v-show="level.isSelected"
      ></div>

      <button
        v-if="level.isSelected"
        class="shared-levels__level-trash"
        :class="level.levelTrashClass"
        @click="trashLevel(level)"
      >
        <i class="bx bx-x"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

enum Level {
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  INFO = "INFO",
  TRACE = "TRACE",
}

interface LevelParams {
  id: number;
  name: Level;
  value: Level;
  levelClass: string;
  levelActionClass: string;
  levelTrashClass: string;
  isSelected: boolean;
}

export default defineComponent({
  name: "SharedLevels",
  props: {
    selectedLevels: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["level", "trash"],
  setup(props, { emit }) {
    const { selectedLevels } = toRefs(props);

    const displayedLevels = computed(() => {
      return Object.values(Level).map((level, levelIndex) => {
        const levelLowerCase = level.toLowerCase();

        return {
          id: levelIndex,
          name: level,
          value: level,
          levelClass: `shared-levels__level--${levelLowerCase}`,
          levelActionClass: `shared-levels__level-action--${levelLowerCase}`,
          levelTrashClass: `shared-levels__level-trash--${levelLowerCase}`,
          isSelected: selectedLevels.value.find(
            (findLevel) => findLevel === level
          ),
        };
      }) as LevelParams[];
    });

    const selectLevel = ({ value }: LevelParams) => {
      emit("level", value);
    };

    const trashLevel = ({ value }: LevelParams) => {
      emit("trash", value);
    };

    return {
      displayedLevels,
      selectLevel,
      trashLevel,
    };
  },
});
</script>

<style lang="scss">
.shared-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__level {
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 2px 5px;

    &--warn {
      background: #e8e8e8;
    }

    &--error {
      background: #f3dbd8;
    }

    &--debug {
      background: #dce5f5;
    }

    &--info {
      background: #d8e9e1;
    }

    &--trace {
      background: #f7edd9;
    }
  }

  &__level-action {
    background: none;
    border: none;
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 12px;
    line-height: 16px;
    transition: 0.3s;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 0.5;
    }

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

  &__level-delimiter {
    height: 10px;
    width: 1px;
    background: rgba($color: #000000, $alpha: 0.1);
    border-radius: 2px;
    margin-left: 5px;
    margin-right: 1px;
  }

  &__level-trash {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 0.5;
    }

    &--fatal {
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
}
</style>
