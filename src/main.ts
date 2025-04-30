import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
// import pinia from "./stores";
import { createPinia } from "pinia";

// Estilos de PrimeVue
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
// Componente ejemplo
import Button from "primevue/button";
import Card from "primevue/card";

const app = createApp(App);

app.use(PrimeVue, {
  theme: { preset: Aura },
});
app.use(createPinia);
app.component("pButton", Button);
app.component("pCard", Card);
app.use(router);
app.mount("#app");
