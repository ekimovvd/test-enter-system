<template>
  <span class="shared-highlight">
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {
  name: "SharedHighlight",
};
</script>

<style lang="scss">
.shared-highlight {
  color: #ba403c;
  background: #f3dbd8;
}
</style>
