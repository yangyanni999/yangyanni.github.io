<template>

<hello-world>
<template #name="{name}">
我是插槽内容
传递的内容为:{{name}}
</template>

</hello-world>
</template>

<script lang="ts" setup>
import Demo from './components/demo.vue';
</script>