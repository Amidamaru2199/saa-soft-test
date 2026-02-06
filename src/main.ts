import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ru from 'element-plus/es/locale/lang/ru'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, {
  locale: ru,
})

app.mount('#app')
