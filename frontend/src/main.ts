import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { checkAuthStatus } from './auth'
import './services/health.js' // Adiciona função testAPI() ao window

// Verificar status de autenticação ao inicializar
checkAuthStatus()

const app = createApp(App)

app.use(router)

app.mount('#app')
