import { createPinia } from "pinia"
const store = createPinia()
const setupStore=function(app) {
  app.use(store)
}
export {store,setupStore}