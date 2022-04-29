<script setup lang="ts">
import { ref, inject } from 'vue'
import { planKey, changePlanKey } from '../../type/injectionKey'

import { defineAsyncComponent } from 'vue'
import { ElementNode } from '@vue/compiler-core';
//导入异步组件
const asyncDemo = defineAsyncComponent(() => import('./async.vue'))
//
const emit = defineEmits(['add'])

//接收祖先组件所传值和方法
const plan = inject(planKey)
const change = inject(changePlanKey)
const changeValue = function () {
	const a = plan?.value
	change(a - 1)
}

//定义自定义指定v-focus
const vFocus = {
	mounted(el:HTMLElement) {
		el.focus()
	}
}

//定义自定义指定v-copy
const content=ref<string>('练习v-copy指令')
const vCopy={
  mounted(el:HTMLElement,binding:any) {
    // el.targetContent=binding.value //targetContent报错捏
    const value=binding.value

    /*
    监听事件el的click事件，执行以下操作：
    1、判断文本是否为空，是则返回
    2、创建textarea文本域，设置为readonly移除可视区域
    3、将值赋给textarea，并将节点插入到页面中
    4、调用textarea的select(),并将目标内容复制到剪切板
    */

    el.addEventListener('click',()=>{
      if(!value) return (console.log('无复制内容'))
      const textarea=document.createElement('textarea')
      textarea.readOnly= true
      textarea.style.position='fixed'
      textarea.style.top='-999999px'
      textarea.value=value
      document.body.appendChild(textarea)
      textarea.select()
      const res=document.execCommand('Copy')
      console.log(res)
    })
  },
}
</script>

<template>
	子组件：{{plan}}
	<button @click="changeValue">减少</button>
	<br />

	--------------------------
	<suspense>
		<template #default>
			<async-demo></async-demo>
		</template>
<template #fallback>
	等待...
</template>
</suspense>

<br />
--------------------------- <br />
指令v-input练习：
<input v-focus />

<br />

指定v-copy练习：
<button v-copy="content">点击复制指令</button>
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
