<template>
  <div class="productInfo">
    <div v-if=!productShowing class="insertEAN">
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
    <div v-if=productShowing class="productData">
      <b-card no-body class="productCard">
        <b-media>
          <template v-slot:aside>
            <!-- localize the alt -->
            <img v-bind:src="imgPath" alt="Product Image">
          </template>
          <p>{{ productName }}</p>
          <p>{{ productVendor }}</p>
          <p>{{ productPortion }}</p>
        </b-media>
      </b-card>
      <b-tabs content-class="mt-3" justified>
        <b-tab :title="$t('tab_nutrition_title')" active>
          <b-img center :src="nutriScoreImgPath" alt="Nutri score image"></b-img>
          <!-- use vue slots to dynamically generate the table with img path inside the rows -->
          <!--
          <div id="nutrientLevels">
            <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
            <span> 8.97 g Fat in moderate quantity </span>
            <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
            <span> 8.97 g Fat in moderate quantity </span>
          </div>
          -->
          <table>
            <tr>
              <td>
                <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
              </td>
              <td>
                {{ fat_100g }} g Fat in {{ fatLvl }} quantity
              </td>
            </tr>
            <tr>
              <td>
                <b-img center :src="satFatLvlImgPath" alt="Fat level indicator"></b-img>
              </td>
              <td>
                {{ saturatedFat_100g }} g Saturated fat in {{ satFatLvl }} quantity
              </td>
            </tr>
            <tr>
              <td>
                <b-img center :src="sugarsLvlImgPath" alt="Fat level indicator"></b-img>
              </td>
              <td>
                {{ sugars_100g }} g Sugar in {{ sugarsLvl }} quantity
              </td>
            </tr>
            <tr>
              <td>
                <b-img center :src="saltLvlImgPath" alt="Fat level indicator"></b-img>
              </td>
              <td>
                {{ salt_100g }} g Salt in {{ saltLvl }} quantity
              </td>
            </tr>

          </table>
          <div id="nutrientLevels">
          </div>
        </b-tab>
        <b-tab :title="$t('tab_ingredients_title')">
          <b-img center :src="novaGroupImgPath" alt="Nova group image"></b-img>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
// const config = require('../../../config.json');
const offApiPath = 'https://world.openfoodfacts.org/api/v0/product/';
const offApiSuffix = '.json';
const productIDTest = '737628064502';

const imagesExt = '.svg';
const imagesContext = require.context('@/assets/productInfo/', true, /\.svg$/);

export default {
  name: 'productInfo',
  data() {
    return {
      ean: productIDTest,
      productShowing: false,
      status: 0,
      // OFF API values (factorize!)
      imgPath: '',
      productName: '',
      productVendor: '',
      productPortion: '',
      nutriScoreImgPath: '',
      novaGroupImgPath: '',

      fatLvl: '',
      satFatLvl: '',
      sugarsLvl: '',
      saltLvl: '',

      fat_100g: '',
      saturatedFat_100g: '',
      sugars_100g: '',
      salt_100g: '',

      fatLvlImgPath: '',
      satFatLvlImgPath: '',
      sugarsLvlImgPath: '',
      saltLvlImgPath: '',
    };
  },
  methods: {
    submitEan() {
      console.log(`Requesting infos about ean ${this.ean}`);
      console.log(offApiPath + this.ean + offApiSuffix);
      axios.get(offApiPath + this.ean + offApiSuffix)
        .then((response) => {
          console.log(response);

          // Status === 1 means the product has been found
          // some random EANs can also return a status 1 so we check the code not do be empty
          this.status = (response.data.status === 1) && (response.data.code !== '');
          this.productShowing = this.status;

          // PRODUCT CARD
          this.imgPath = response.data.product.image_thumb_url.replace('100.jpg', 'full.jpg');
          this.productName = response.data.product.product_name;
          // Alternatively in response.data.brands
          // Absurd way to access brands_tags[0]
          [this.productVendor] = response.data.product.brands_tags;
          this.productPortion = response.data.product.quantity;

          // NUTRITION TAB
          const nutriScore = response.data.product.nutriscore_grade;
          this.nutriScoreImgPath = imagesContext(`./nutriScore/${nutriScore}${imagesExt}`);

          this.fatLvl = response.data.product.nutrient_levels.fat;
          this.satFatLvl = response.data.product.nutrient_levels['saturated-fat'];
          this.sugarsLvl = response.data.product.nutrient_levels.sugars;
          this.saltLvl = response.data.product.nutrient_levels.salt;

          this.fat_100g = response.data.product.nutriments.fat_100g;
          this.saturatedFat_100g = response.data.product.nutriments['saturated-fat_100g'];
          this.sugars_100g = response.data.product.nutriments.sugars_100g;
          this.salt_100g = response.data.product.nutriments.salt_100g;

          this.fatLvlImgPath = imagesContext(`./nutrientLevels/${this.fatLvl}${imagesExt}`);
          this.satFatLvlImgPath = imagesContext(`./nutrientLevels/${this.satFatLvl}${imagesExt}`);
          this.sugarsLvlImgPath = imagesContext(`./nutrientLevels/${this.sugarsLvl}${imagesExt}`);
          this.saltLvlImgPath = imagesContext(`./nutrientLevels/${this.saltLvl}${imagesExt}`);


          console.log(this.fatLvlImgPath);
          console.log(this.satFatLvlImgPath);
          console.log(this.sugarsLvlImgPath);
          console.log(this.saltLvlImgPath);

          // INGREDIENTS TAB
          const novaGroup = response.data.product.nova_group;
          this.novaGroupImgPath = imagesContext(`./novaGroup/${novaGroup}${imagesExt}`);
        }).catch((error) => {
          alert(JSON.stringify(error));
          // console.log(error);
        });
    },
  },
};
</script>

<i18n>
{
  "en": {
    "tab_nutrition_title" : "Nutrition",
    "tab_ingredients_title" : "Ingredients"
  },
  "it": {
    "tab_nutrition_title" : "Valori nutrizionali",
    "tab_ingredients_title" : "Ingredienti"
  }
}
</i18n>

<style lang="sass">
  @import './ProductInfo.sass';
</style>
