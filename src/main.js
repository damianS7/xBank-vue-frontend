import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'

// Estilos de PrimeVue
import 'primevue/resources/themes/lara-light-blue/theme.css' // Puedes cambiar el tema
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Componente ejemplo
import Button from 'primevue/button'

const app = createApp(App)

app.use(PrimeVue)
app.component('Button', Button)

app.mount('#app')