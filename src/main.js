import { createApp } from 'vue'
import App from './App.vue'
import  'element-plus/dist/index.css'
const app = createApp(App)
app.mount('#app')

// 1. 我们先自己构造有些假数据， 能实现根据位置渲染内容