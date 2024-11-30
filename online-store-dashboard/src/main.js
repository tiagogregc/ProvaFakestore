import { createApp } from "vue";
import App from "./app.vue"; // Confirme o nome do arquivo
import axios from "axios";
import router from "./router/index.js";
import store from "./store/index.js";
import "./assets/style.css"; // Importação do CSS global


const app = createApp(App);

// Configuração global do Axios
app.config.globalProperties.$axios = axios;

// Uso do Vue Router e Vuex
app.use(router);
app.use(store);

// Monta a aplicação
app.mount("#app");
