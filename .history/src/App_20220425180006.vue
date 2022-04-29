<template>

<demo>
<template #header="scoped">
我是插槽内容
传递的内容为:{{scoped.value}}
</template>

</demo>
</template>

<script lang="ts" setup>
import demo from './components/demo.vue';
</script>