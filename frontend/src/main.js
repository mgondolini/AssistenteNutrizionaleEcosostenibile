import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Axios from 'axios';
import App from './App.vue';
import router from './router';
import './custom.scss';
import i18n from './i18n';

Vue.use(BootstrapVue);

/* Set this to false to prevent the production tip on Vue startup */
Vue.config.productionTip = false;

global.login = function login(t, l) {
  Vue.prototype.$isLogged = l;
  Vue.prototype.$http = Axios.create({
    baseURL: 'http://localhost:8081/',
    timeout: 2000,
    headers: { token: t },
  });
};

if (localStorage.ecoAssToken) {
  global.login(localStorage.ecoAssToken, true);
} else {
  global.login('InvalidToken', false);
}

global.config = require('../config.json');

new Vue({
  router,
  i18n,
  render(h) { return h(App); },
}).$mount('#app');
