<template>
  <div id="app">
    <navbar class="nav-bar"></navbar>
    <router-view/>
    <selectProduct></selectProduct>
  </div>
</template>

<script>
import Navbar from './components/Navbar/Navbar.vue';
import SelectProduct from './components/SelectProduct/SelectProduct.vue';

export default {
  name: 'app',
  components: {
    navbar: Navbar,
    selectProduct: SelectProduct,
  },
};
</script>

<style lang="sass">
  @import './components/Navbar/navbar.sass'
</style>
