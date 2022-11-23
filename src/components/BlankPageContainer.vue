<template>
  <div class="blank-page-container">
    <div v-if="props.title !== undefined" class="title">
      <h3>{{ props.title }}</h3>

      <a-divider style="margin: 16px 0" />
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()
</script>

<style lang="stylus" scoped>
.blank-page-container
  position relative
  height calc(100vh - 155px)
  margin 20px
  overflow auto
  background-color #fff

  .title
    position sticky
    top 0
    z-index 10
    padding 20px 20px 0 20px
    background-color rgba(255, 255, 255, 0.7)
    backdrop-filter saturate(100%) blur(20px)

  .content
    padding 16px 20px 20px 20px
</style>
