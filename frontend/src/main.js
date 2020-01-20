import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Axios from 'axios';
import Vuex from 'vuex';
import VueCarousel from 'vue-carousel';
import VueQuagga from 'vue-quaggajs';
import App from './App.vue';
import router from './router';
import './custom.sass';
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
    username: '',
    http: Axios.create({
      baseURL: 'http://localhost:8081/',
      timeout: 10000,
      headers: { token: 'InvalidToken' },
    }),
  },
  mutations: {
    login(state, newState) {
      state.isLogged = true;
      state.username = newState.user;
      state.http = Axios.create({
        baseURL: 'http://localhost:8081/',
        timeout: 10000,
        headers: { token: newState.token },
      });
    },
    logout(state) {
      state.isLogged = false;
      state.username = '';
      state.http = Axios.create({
        baseURL: 'http://localhost:8081/',
        timeout: 10000,
        headers: { token: 'InvalidToken' },
      });
    },
  },
});

if (localStorage.ecoAssToken !== 'InvalidToken') {
  const t = localStorage.ecoAssToken;
  const u = localStorage.ecoAssUser;
  store.commit('login', { token: t, user: u });
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
