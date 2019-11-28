import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import './custom.scss';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  render(h) { return h(App); },
}).$mount('#app');
