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

Vue.prototype.$http = Axios;

Vue.prototype.$isLogged = false;

global.config = require('../config.json');


new Vue({
  router,
  i18n,
  render(h) { return h(App); },
}).$mount('#app');
