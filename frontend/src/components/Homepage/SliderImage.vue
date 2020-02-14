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
        data-name="Cheese">
        <img class="homeImagesScroll" src="../../assets/home/cheese.png" alt="cheese">
    </slide>
    <slide
        data-index="2"
        data-name="Rice">
        <img class="homeImagesScroll" src="../../assets/home/rice.png" alt="rice">
    </slide>
    <slide
        data-index="3"
        data-name="Carrots">
        <img class="homeImagesScroll" src="../../assets/home/carrots.jpg" alt="Corrots">
    </slide>
    <slide
        data-index="4"
        data-name="Bread">
        <img class="homeImagesScroll" src="../../assets/home/bread.jpg" alt="bread">
    </slide>
    <slide
        data-index="5"
        data-name="Chickpeas">
        <img class="homeImagesScroll" src="../../assets/home/chickpeas.jpg" alt="chickpeas">
    </slide>
    <slide
        data-index="6"
        data-name="Eggs">
        <img class="homeImagesScroll" src="../../assets/home/eggs.jpg" alt="eggs">
    </slide>
    <slide
        data-index="7"
        data-name="Soup">
        <img class="homeImagesScroll" src="../../assets/home/soup.jpg" alt="soup">
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
