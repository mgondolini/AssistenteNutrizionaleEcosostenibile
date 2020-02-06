import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Axios from 'axios';
import Vuex from 'vuex';
import VueCarousel from 'vue-carousel';
import VueQuagga from 'vue-quaggajs';
import App from './App.vue';
import router from './router';
import './custom.sass';
import './lightMode.sass';
import './darkMode.sass';
import 'bootstrap/dist/css/bootstrap.css';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import i18n from './i18n';

global.config = require('../config.json');
/* Set this to false to prevent the production tip on Vue startup */
Vue.config.productionTip = false;
Vue.use(VueQuagga);
Vue.use(VueCarousel);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuex);

let tmpDark = false;
if (localStorage.darkMode !== undefined) {
  tmpDark = localStorage.darkMode === 'true';
}

const store = new Vuex.Store({
  state: {
    isLogged: false,
    darkMode: tmpDark,
    username: '',
    http: Axios.create({
      timeout: 10000,
      headers: { token: 'InvalidToken' },
    }),
  },
  mutations: {
    login(state, newState) {
      localStorage.ecoAssToken = newState.token;
      localStorage.ecoAssUser = newState.user;
      state.isLogged = true;
      state.username = newState.user;
      state.http = Axios.create({
        timeout: 10000,
        headers: { token: newState.token },
      });
    },
    logout(state) {
      localStorage.ecoAssToken = 'InvalidToken';
      localStorage.ecoAssUser = '';
      state.isLogged = false;
      state.username = '';
      state.http = Axios.create({
        timeout: 10000,
        headers: { token: 'InvalidToken' },
      });
    },
    switchMode(state) {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        localStorage.darkMode = 'true';
      } else {
        localStorage.darkMode = 'false';
      }
    },
  },
});

if (localStorage.ecoAssToken === undefined) {
  localStorage.ecoAssToken = 'InvalidToken';
}
if (localStorage.ecoAssToken !== 'InvalidToken') {
  const t = localStorage.ecoAssToken;
  const u = localStorage.ecoAssUser;
  store.commit('login', { token: t, user: u });
  store.state.http.get('api/checkOldToken')
    .then((res) => {
      if (res.data !== 'Ok') {
        store.commit('logout');
      }
    }).catch(() => {
      store.commit('logout');
    });
} else {
  store.commit('logout');
}

router.beforeEach((to, from, next) => {
  const realRoute = ['/', '/login', '/info_prod', '/profile', '/meals', '/calculate_meal_composition', '/registration'];
  const loggedRoute = ['/profile', '/meals', '/calculate_meal_composition'];
  const p = to.path;
  if (!realRoute.includes(p)) {
    next('/');
  } else if (loggedRoute.includes(p) && !store.state.isLogged) {
    next('/login');
  } else {
    next();
  }
});

new Vue({
  router,
  i18n,
  store,
  render(h) { return h(App); },
}).$mount('#app');
