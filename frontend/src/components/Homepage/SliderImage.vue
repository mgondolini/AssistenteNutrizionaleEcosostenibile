<template>
  <carousel
  :autoplay="true"
  :loop="true"
  :perPage=1
  >

    <slide
        data-index="0"
        data-name="Sostegno Ambiente"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/img_sliding.jpg">
    </slide>
    <slide
        data-index="1"
        data-name="Sostegno Ambiente"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/sostegno.png">
    </slide>
    <slide
        data-index="2"
        data-name="Cheese"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/cheese.png">
    </slide>
    <slide
        data-index="3"
        data-name="Rice"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/rice.png">
    </slide>
    <slide
        data-index="4"
        data-name="Carrots"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/carrots.jpg">
    </slide>
    <slide
        data-index="5"
        data-name="Bread"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/bread.jpg">
    </slide>
    <slide
        data-index="6"
        data-name="Legumes"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/chickpeas.jpg">
    </slide>
    <slide
        data-index="7"
        data-name="Eggs"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/eggs.jpg">
    </slide>
    <slide
        data-index="8"
        data-name="Soup"
        @slideclick="handleSlideClick">
        <img class="homeImagesScroll" src="../../assets/home/soup.jpg">
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
  methods: {
    handleSlideClick(dataset) {
      console.log(dataset.index, dataset.name);
    },
  },
};
</script>
