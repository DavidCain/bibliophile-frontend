import Vue from "vue";
// TODO: Import just the specific icons we use.
// See: https://bootstrap-vue.org/docs/icons
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  render: h => h(App)
}).$mount("#app");
