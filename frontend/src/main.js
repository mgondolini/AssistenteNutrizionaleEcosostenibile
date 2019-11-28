import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import './custom.scss';

Vue.use(BootstrapVue);

/* Set this to false to prevent the production tip on Vue startup */
Vue.config.productionTip = false;
Vue.prototype.$isLogged = false;

new Vue({
  router,
  render(h) { return h(App); },
}).$mount('#app');
