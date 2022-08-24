import {
    createApp
} from 'vue'
import App from './App.vue'

createApp(App, {
    baseUrl: 'http://localhost:8080',
    admin: true
}).mount('#app')