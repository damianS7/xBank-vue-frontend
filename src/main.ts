import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import pinia from "./stores";
// Estilos de PrimeVue
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// Componente ejemplo
import Button from "primevue/button";
import Card from "primevue/card";

const app = createApp(App);

app.use(PrimeVue);
app.use(pinia);
app.component("pButton", Button);
app.component("pCard", Card);
app.use(router);
app.mount("#app");
