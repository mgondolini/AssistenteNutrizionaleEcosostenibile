import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/Home.vue';
import About from '../views/About.vue';
import Login from '../views/Login/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/info_prod',
    name: 'about',
    component: About,
  },
  {
    path: '/profile',
    name: 'profile',
    component: About,
  },
  {
    path: '/last_meals',
    name: 'last_meal',
    component: About,
  },
  {
    path: '/new_meal',
    name: 'new_meal',
    component: About,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
