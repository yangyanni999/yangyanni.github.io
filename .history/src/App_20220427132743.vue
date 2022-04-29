<template>
{{plan}}
<button @click="add">增加</button>
<Demo></Demo>
</template>

<script lang="ts" setup>
import Demo from './components/demo.vue';
import { provide,ref } from 'vue';
const plan=ref(1)
const add=function(){
  plan.value++
}
const change=function(value:number){
  // plan.value=value
  console.log(1)
}
provide('plan',plan)
provide('change',change)

</script>
