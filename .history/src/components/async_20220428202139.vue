<template>
  <div>
    {{number}}
  </div>
</template>

<script>
import { defineComponent ,ref} from 'vue'

export default defineComponent({
  setup() {
    const number=ref(0)
    new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(1)
      })
    }).then((value)=>{
      number.value=value
    })

    return {
      number,
    }
  },
})
</script>
