import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/scss/main.scss";

import { WebSocketService } from "@/services";

const app = createApp(App);

app.provide("$webSocketService", new WebSocketService());

app.mount("#app");
