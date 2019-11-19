<template>
  <div class="homepage">
    <div class="bg-img"></div>
    <div class="page">
      <HelloWorld msg="HOMEPAGE"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'home',
  components: {
    HelloWorld,
  },
};
</script>

<style lang="scss">
  @import './home.scss';
</style>
