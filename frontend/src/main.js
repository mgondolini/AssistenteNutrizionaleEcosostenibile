import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Axios from 'axios';
import Vuex from 'vuex';
import VueCarousel from 'vue-carousel';
import VueQuagga from 'vue-quaggajs';
import App from './App.vue';
import router from './router';
import './custom.scss';
import i18n from './i18n';


Vue.use(VueQuagga);

Vue.use(VueCarousel);

Vue.use(BootstrapVue);

Vue.use(Vuex);

/* Set this to false to prevent the production tip on Vue startup */
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    isLogged: false,
    http: Axios.create({
      baseURL: 'http://localhost:8081/',
      timeout: 10000,
      headers: { token: 'InvalidToken' },
    }),
  },
  mutations: {
    login(state, t) {
      state.isLogged = true;
      state.http = Axios.create({
        baseURL: 'http://localhost:8081/',
        timeout: 10000,
        headers: { token: t },
      });
    },
    logout(state) {
      state.isLogged = false;
      state.http = Axios.create({
        baseURL: 'http://localhost:8081/',
        timeout: 10000,
        headers: { token: 'InvalidToken' },
      });
    },
  },
});

if (localStorage.ecoAssToken) {
  store.commit('login', localStorage.ecoAssToken);
  store.state.http.get('api/checkToken')
    .then().catch(() => {
      store.commit('logout');
    });
} else {
  store.commit('logout');
}

global.config = require('../config.json');

new Vue({
  router,
  i18n,
  store,
  render(h) { return h(App); },
}).$mount('#app');
