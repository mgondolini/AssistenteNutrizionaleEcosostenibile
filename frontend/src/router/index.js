import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/Home.vue';
import About from '../views/About.vue';
import Login from '../views/Login/Login.vue';
import LastMeals from '../views/LastMeals/LastMeals.vue';
import CalculateMeal from '../views/CalculateMeal/CalculateMeal.vue';
import Profile from '../views/Profile/Profile.vue';
import NutritionFacts from '../views/LastMeals/NutritionFacts.vue'; // CAMBIARE


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
    component: Profile,
  },
  {
    path: '/last_meals',
    name: 'last_meals',
    component: LastMeals,
  },
  {
    path: '/nutrition_facts',
    name: 'nutrition_facts',
    component: NutritionFacts,
  },
  {
    path: '/new_meal',
    name: 'new_meal',
    component: About,
  },
  {
    path: '/calculate_meal_composition',
    name: 'calculate_meal_composition',
    component: CalculateMeal,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
