<template>
  <carousel
  :autoplay="true"
  :loop="true"
  :perPage=1
  >
    <slide
        data-index="0"
        data-name="Sostegno Ambiente">
        <img v-if='$root.$i18n.locale === "it" '
          class="homeImagesScroll" src="../../assets/home/img_sliding_ita.jpg" alt="intro">
        <img v-if='$root.$i18n.locale === "en" '
          class="homeImagesScroll" src="../../assets/home/img_sliding_eng.jpg" alt="intro">
    </slide>
    <slide
        data-index="1"
        data-name="addMeal">
        <img class="homeImagesScroll" src="../../assets/home/infoAddMeal.jpg" alt="addMeal">
    </slide>
    <slide
        data-index="2"
        data-name="scanning">
        <img class="homeImagesScroll" src="../../assets/home/scanning.jpg" alt="scanning">
    </slide>
    <slide
        data-index="3"
        data-name="lightDark">
        <img class="homeImagesScroll" src="../../assets/home/lightDark.jpg" alt="lightDark">
    </slide>
    <slide
        data-index="4"
        data-name="graphs">
        <img class="homeImagesScroll" src="../../assets/home/graphs.jpg" alt="graphs">
    </slide>
    <slide
        data-index="5"
        data-name="ach">
        <img class="homeImagesScroll" src="../../assets/home/info.jpg" alt="ach">
    </slide>
  </carousel>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';

export default {
  components: {
    Carousel,
    Slide,
  },
};
</script>
