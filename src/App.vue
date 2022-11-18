<template>
  <Editor v-model:modelValue="state"></Editor>
</template>

<script>
import data from './data.json'
import { ref, provide } from 'vue'
import Editor from './packages/editor'
import { registerConfig as config } from './utils/editor-config'
export default {
  name: 'App',
  components: { Editor },
  setup() {
    const state = ref(data)

    provide('config', config) // 提供一个值，可以被后代组件注入。 将组件提供给子孙组件，可通过inject注入
    return {
      state
    }
  }
}
</script>

<style lang="scss">
#app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
