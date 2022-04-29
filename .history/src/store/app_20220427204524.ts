import { defineStore } from 'pinia';
export const useStore = defineStore({
  id: 'app',
  state: () => {
    return {
      name: 'Yn',
      age: 21
    }
  },
  getters: {
    getName () {
      return this.name
    }
    ,
    getAge () {
      return this.age
    }
  },
  actions: {
    setName (value) {
      try {
        this.name=value
      } catch (error) {
        console.log(error)
      }
    },
    setAge (value) {
      try {
        this.age=value
      } catch (error) {
        console.log(error)
      }
    }
  }
})