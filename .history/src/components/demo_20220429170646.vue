<script setup lang="ts">
import { ref, inject } from 'vue'
import { planKey, changePlanKey } from '../../type/injectionKey'

import { defineAsyncComponent } from 'vue'
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
  mounted(el:any,binding:any) {
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

//定义自定义组件v-longpress
/*
实现思路:
1、判断接收值是否是一个函数，不是则return
2、定义一个计时器，判断时间有无超过1秒，无则为长按，否则判定为普通click事件
3、在2的基础上定义开始方法、取消方法、和执行函数
4、添加事件监听器
5、组件销毁时移除事件监听
*/
const vLongpress={
  beforeMount(el:any,binding:any) {
    const cb=binding.value
    if(typeof cb!=='function') {
      return (console.log('error'))
    }
    let timer=null as null|number
    const start=(e:any)=>{
        if(el.type==='click'&&e.button!=='0'){
            return
        }
        if(timer===null){
           timer=setTimeout(()=>{
             handle(e)
            },1000)
        }
    }
    const cancel=(e:any)=>{
        if(timer!==null){
            clearTimeout(timer)
            timer=null
        }
    }
    const handle=(e:any)=>{
        cb(e)
    }
    el.addEventListener('mousedown',start)
    el.addEventListener('touchstart',start)

    el.addEventListener('mouseout',cancel)
     el.addEventListener('click',cancel)
      el.addEventListener('touched',cancel)
       el.addEventListener('touchcancel',cancel)

  },
  unmounted(el:any) {
    el.removeEventListener('mousedown',()=>{})
    el.removeEventListener('mouseout',()=>{})
    el.removeEventListener('touchstart',()=>{})
     el.removeEventListener('click',()=>{})
      el.removeEventListener('touched',()=>{})
       el.removeEventListener('touchcancel',()=>{})
  },
}
const press=function(){
  alert('长按成功啦')
}


//定义防抖组件v-debounce
const vDebounce={
mounted(el:any,binding:any) {
  el.value=binding.value
  console.log(el.value)
  const timer=null
  // el.addEventListener('click',()=>{
  //   if(timer==null)
  //   {
  //     setTimeout(()=>{
  //       binding.value()
  //     })
  //   }
  // })
},
}
const func=function(){

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
<div v-copy="content">{{content}}</div>
<button @click="changeContent">改变复制内容</button>
<br />

指定v-longpress练习:
<span v-longpress="press">长按弹出弹框</span>
<br />

指定v-debounce练习:
<span v-debounce="func(5)"></span>
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
