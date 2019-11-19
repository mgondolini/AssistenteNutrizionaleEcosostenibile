<template>
  <div id="app">
    <navbar class="nav-bar"></navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar/Navbar.vue';

export default {
  name: 'app',
  components: {
    navbar: Navbar,
  },
};
</script>

<style lang="scss">
  @import './components/Navbar/navbar.scss';
</style>
