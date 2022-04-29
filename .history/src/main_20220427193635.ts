import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store/index.js'
const app=createApp(App)
setupStore(app)
app.mount('#app')
