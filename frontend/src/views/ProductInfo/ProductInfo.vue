<template>
  <div class="productInfo">
    <div id="insertEAN">
      <p>
        <label for="ean">EAN code</label>
        <input
          id="ean"
          v-model="ean"
          value=""
        >
      </p>
      <p>EAN is: {{ ean }}</p>
      <div>
        <b-button v-on:click="submitEan()">Submit EAN</b-button>
        <b-button>Upload photo</b-button>
      </div>
      <p v-if=!status > Product not found </p>
    </div>

  </div>
</template>

<script>
const axios = require('axios');
// const config = require('../../../config.json');
const offApiPath = 'https://world.openfoodfacts.org/api/v0/product/';
const offApiSuffix = '.json';
const productIDTest = '737628064502';

export default {
  name: 'productInfo',
  data() {
    return {
      ean: productIDTest,
      productShowing: false,
      status: 0,
      // OFF API values
      imgPath: '',
    };
  },
  methods: {
    submitEan() {
      console.log(`Requesting infos about ean ${this.ean}`);
      console.log(offApiPath + this.ean + offApiSuffix);
      axios.get(offApiPath + this.ean + offApiSuffix)
        .then((response) => {
          console.log(response);
          this.status = (response.data.status === 1) && (response.data.code !== '');
          this.imgPath = response.data.product.image_thumb_url.replace('100.jpg', 'full.jpg');
          console.log(`Status ${this.status}`);
          console.log(`img ${this.imgPath}`);
        }).catch((error) => {
          alert(JSON.stringify(error));
          // console.log(error);
        });
    },
  },
};
</script>
<style lang="scss">
  @import './ProductInfo.scss';
</style>
