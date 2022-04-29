<template>
  <div>
    {{number}}
    {{time}}
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
    const time=ref('time')
    time.value='time1'
    return {
      number,
      time
    }
  },
})
</script>
