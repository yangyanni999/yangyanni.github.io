<template>
  <div>
    {{number}}
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const number=ref()
    const func=new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(1)
      })
    }).then((value)=>{
      number.value=value
    })

    return {
      number
    }
  },
})
</script>
