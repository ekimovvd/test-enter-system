<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <input
    class="ui-input"
    type="text"
    :placeholder="placeholder"
    :value="value"
    @input="changeValue"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UIInput",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  emits: ["changed"],
  setup(_, { emit }) {
    const changeValue = (event: Event) => {
      emit("changed", (event.target as HTMLInputElement).value);
    };

    return {
      changeValue,
    };
  },
});
</script>

<style lang="scss">
.ui-input {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px 16px;
  border: none;
  outline: none;
  width: 100%;

  &::placeholder {
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #999999;
    opacity: 1;
  }
}
</style>
