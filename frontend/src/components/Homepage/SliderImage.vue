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
        data-name="1">
        <img class="homeImagesScroll" src="../../assets/home/merged/12.png" alt="1">
    </slide>
    <slide
        data-index="2"
        data-name="2">
        <img class="homeImagesScroll" src="../../assets/home/merged/34.png" alt="2">
    </slide>
    <slide
        data-index="3"
        data-name="3">
        <img class="homeImagesScroll" src="../../assets/home/merged/56.png" alt="3">
    </slide>
    <slide
        data-index="4"
        data-name="4">
        <img class="homeImagesScroll" src="../../assets/home/merged/78.png" alt="4">
    </slide>
    <slide
        data-index="5"
        data-name="5">
        <img class="homeImagesScroll" src="../../assets/home/merged/910.png" alt="5">
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
