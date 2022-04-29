<template>

<demo @add="add">
<template #header="scoped">
我是插槽内容
传递的内容为:<br />
name:{{scoped.value.name}}<br />
age:{{scoped.value.age}}
</template>

</demo>
</template>

<script lang="ts" setup>
import demo from './components/demo.vue';
const plan=[]
const add=function(date){
  plan.push(date)
  console.log(date)
}
</script>
