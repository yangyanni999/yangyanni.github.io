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
    getName (): string {
      return this.name
    }
    ,
    getAge ():number{
      return this.age
    }
  },
  actions: {
    setName (value:string) {
      try {
        this.name=value
      } catch (error) {
        console.log(error)
      }
    },
    setAge (value:number) {
      try {
        this.age=value
      } catch (error) {
        console.log(error)
      }
    }
  }
})