<template>
{{plan}}
<button @click="add">增加</button>
<Demo></Demo>
</template>

<script lang="ts" setup>
import Demo from './components/demo.vue';
import {planKey,changePlanKey} from '../type/injectionKey'
import { provide,ref } from 'vue';
const plan=ref<number>(1)
const add=function(){
  plan.value++
}

provide(planKey,plan)
provide(changePlanKey,(value)=>{
plan.value=value
})

</script>
