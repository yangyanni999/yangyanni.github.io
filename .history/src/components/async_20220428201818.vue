<template>
  <div>
    {{number}}
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const number=ref()
    const func=new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(1)
      },1000)
    }).then((value)=>{
      number.value=value
    })

    return {
      number
    }
  },
})
</script>
