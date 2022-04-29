<script setup lang="ts">
import { ref } from 'vue'

const value=ref<string>('hh')
const count = ref(0)
</script>

<template>
 <slot name="header" :value="value"></slot>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
