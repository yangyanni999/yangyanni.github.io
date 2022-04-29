<script setup lang="ts">
import { ref ,inject
} from 'vue'
import {planKey,changePlanKey} from '../../type/injectionKey'
const emit=defineEmits(['add'])
const value=ref<arr>({
  name:'Yn',
  age:21
})
type arr={
  name:string,
  age:number
}

const plan=inject(planKey)
const change=inject(changePlanKey)
const changeValue=function(){
  change(plan.value-1)
}
</script>

<template>
子组件：{{plan}}
<button @click="changeValue">减少</button>
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
