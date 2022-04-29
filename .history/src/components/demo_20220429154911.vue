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
//1、定义复制内容
const content=ref<string>('练习v-copy指令')
//2、定义改变复制内容方法
const changeContent=function(){
 content.value='改变复制内容啦'
}
const vCopy={
  mounted(el,binding:any) {
    // el如果为HTMLElement类型，targetContent和value都报错捏
    // el.targetContent=binding.value
    el.value=binding.value
    /*
    监听事件el的click事件，执行以下操作：
    1、判断文本是否为空，是则返回
    2、创建textarea文本域，设置为readonly移除可视区域
    3、将值赋给textarea，并将节点插入到页面中
    4、调用textarea的select(),并将目标内容复制到剪切板
    5、移除texteara标签
    6、内容更新时要及时更新value
    7、销毁的时候要清空click事件
    */

    el.addEventListener('click',()=>{
      if(!el.value) return (console.log('无复制内容'))
      if(navigator.clipboard){
          navigator.clipboard.writeText(el.value)
      }
      else {
      const textarea=document.createElement('textarea')
      textarea.readOnly= true
      textarea.style.position='fixed'
      textarea.style.top='-999999px'
      // textarea.value=el.targetContent
      textarea.value=el.value
      document.body.appendChild(textarea)
      textarea.select()
      const res=document.execCommand('Copy')
      console.log(res)
      document.body.removeChild(textarea)
      }
    })
  },
    updated(el:any,binding:any) {
      // el.targetContent=binding.value
      el.value=binding.value
    },
    unmounted(el:any){
      el.removeEventListener('click',()=>{})
    },
}

//定义自定义组件
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
<div v-copy="content">{{content}}</div>
<button @click="changeContent">改变复制内容</button>
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
