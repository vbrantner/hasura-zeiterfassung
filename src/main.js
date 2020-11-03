import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";
import vuetify from "./plugins/vuetify";
import "@/plugins/firebase";
import firebase from "firebase"

Vue.config.productionTip = false;

Vue.config.productionTip = false;
const app = new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  vuetify,
  render: h => h(App)
});

firebase.auth().onAuthStateChanged(user => {
  store.commit("setUser", user);
  app.$mount("#app");
});
