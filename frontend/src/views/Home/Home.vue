<template>
  <div class="homepage">
    <div class="bg-img"></div>
    <div class="page">
      <Homepage msg="Assistente Nutrizionale Ecosostenibile"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Homepage from '@/components/Homepage/Homepage.vue';

export default {
  name: 'home',
  components: {
    Homepage,
  },
};
</script>

<style lang="scss">
  @import './home.scss';
</style>
