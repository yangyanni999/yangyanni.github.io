<template>
{{store.getName}}<br>
<button @click="changeName">修改name</button>
{{plan}}
<button @click="add">增加</button>
<Demo></Demo>
</template>

<script lang="ts" setup>
import Demo from './components/demo.vue';
import {planKey,changePlanKey} from '../type/injectionKey'
import { computed, provide,ref } from 'vue';
import { useStore } from './store/app';
const plan=ref<number>(1)
const add=function(){
  plan.value++
}

provide(planKey,plan)
provide(changePlanKey,(value:number)=>{
plan.value=value
})
const store=useStore()
const changeName=function(){
store.$patch((state)=>{
  state.name='heihei'
})
}
</script>
