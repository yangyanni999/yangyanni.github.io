<script setup lang="ts">
import { ref ,defineEmits
} from 'vue'

const emit=defineEmits(['add'])
const value=ref<arr>({
  name:'Yn',
  age:21
})
type arr={
  name:string,
  age:number
}
const add=function(){
  emit('add',value.value.age--)
}
const count = ref(0)
</script>

<template>
<div @click="add"></div>
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
