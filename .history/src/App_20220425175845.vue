<template>

<demo>
<template #header="{name}">
我是插槽内容
传递的内容为:{{name}}
</template>

</demo>
</template>

<script lang="ts" setup>
import demo from './components/demo.vue';
</script>