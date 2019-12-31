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
          <div class="nutritionIndicators">
            <table>
              <tr>
                <td>
                  <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
                </td>
                <td>
                  {{ fat }} g Fat in {{ fatLvl }} quantity
                </td>
              </tr>
              <tr>
                <td>
                  <b-img center :src="satFatLvlImgPath" alt="Fat level indicator"></b-img>
                </td>
                <td>
                  {{ saturatedFat }} g Saturated fat in {{ satFatLvl }} quantity
                </td>
              </tr>
              <tr>
                <td>
                  <b-img center :src="sugarLvlImgPath" alt="Fat level indicator"></b-img>
                </td>
                <td>
                  {{ sugar }} g Sugar in {{ sugarLvl }} quantity
                </td>
              </tr>
              <tr>
                <td>
                  <b-img center :src="saltLvlImgPath" alt="Fat level indicator"></b-img>
                </td>
                <td>
                  {{ salt }} g Salt in {{ saltLvl }} quantity
                </td>
              </tr>

            </table>
          </div>
          <div class="nutritionTable">
            <b-table striped hover :items="nutritionTableItems"></b-table>
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

// TODO add function to format numbers (trim decimals and add dots for thousands)

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
      sugarLvl: '',
      saltLvl: '',

      fat: '',
      saturatedFat: '',
      sugar: '',
      salt: '',

      energyKj: '',
      energyKcal: '',
      carbohydrates: '',
      proteins: '',
      sodium: '',
      fiber: '',

      fatLvlImgPath: '',
      satFatLvlImgPath: '',
      sugarLvlImgPath: '',
      saltLvlImgPath: '',

      nutritionTableItems: [
        // { nutrition_fact: 'stonks', for_100g: 0 },
      ],
      /*
      nutritionTableItems: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ],
*/
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
          // some random EANs can also return a status 1 so we check the code not to be empty
          this.status = (response.data.status === 1)
                        && (response.data.code !== '')
                        && (Object.prototype.hasOwnProperty.call(response.data, 'product'));
          this.productShowing = this.status;
          // Copying response.data.product
          const { product } = response.data;

          // PRODUCT CARD
          this.imgPath = product.image_thumb_url.replace('100.jpg', 'full.jpg');
          this.productName = product.product_name;
          // Alternatively in response.data.brands
          // Absurd way to access brands_tags[0]
          [this.productVendor] = product.brands_tags;
          this.productPortion = product.quantity;

          // NUTRITION TAB
          const nutriScore = response.data.product.nutriscore_grade;
          this.nutriScoreImgPath = imagesContext(`./nutriScore/${nutriScore}${imagesExt}`);

          // nutritional levels
          this.fatLvl = product.nutrient_levels.fat;
          this.satFatLvl = product.nutrient_levels['saturated-fat'];
          this.sugarLvl = product.nutrient_levels.sugars;
          this.saltLvl = product.nutrient_levels.salt;

          // nutritional values
          this.fat = product.nutriments.fat_100g || 0;
          this.saturatedFat = product.nutriments['saturated-fat_100g'] || 0;
          this.sugar = product.nutriments.sugars_100g || 0;
          this.salt = product.nutriments.salt_100g || 0;

          this.energyKj = product.nutriments['energy-kj_100g'] || 0;
          this.energyKcal = product.nutriments['energy-kcal_100g'] || 0;
          this.carbohydrates = product.nutriments.carbohydrates_100g || 0;
          this.proteins = product.nutriments.proteins_100g || 0;
          this.sodium = product.nutriments.sodium_100g || 0;
          this.fiber = product.nutriments.fiber_100g || 0;

          this.nutritionTableItems.push({ nutrition_fact: 'fat', for_100g: this.fat });
          this.nutritionTableItems.push({ nutrition_fact: 'saturatedFat', for_100g: this.saturatedFat });
          this.nutritionTableItems.push({ nutrition_fact: 'sugar', for_100g: this.sugar });
          this.nutritionTableItems.push({ nutrition_fact: 'salt', for_100g: this.salt });
          this.nutritionTableItems.push({ nutrition_fact: 'energyKj', for_100g: this.energyKj });
          this.nutritionTableItems.push({ nutrition_fact: 'energyKcal', for_100g: this.energyKcal });
          this.nutritionTableItems.push({ nutrition_fact: 'carbohydrates', for_100g: this.carbohydrates });
          this.nutritionTableItems.push({ nutrition_fact: 'proteins', for_100g: this.proteins });
          this.nutritionTableItems.push({ nutrition_fact: 'sodium', for_100g: this.sodium });
          // this.nutritionTableItems.push({ nutrition_fact: 'fiber', for_100g: this.fiber });

          console.log(this.nutritionTableItems);

          this.fatLvlImgPath = imagesContext(`./nutrientLevels/${this.fatLvl}${imagesExt}`);
          this.satFatLvlImgPath = imagesContext(`./nutrientLevels/${this.satFatLvl}${imagesExt}`);
          this.sugarLvlImgPath = imagesContext(`./nutrientLevels/${this.sugarLvl}${imagesExt}`);
          this.saltLvlImgPath = imagesContext(`./nutrientLevels/${this.saltLvl}${imagesExt}`);

          // INGREDIENTS TAB
          const novaGroup = product.nova_group;
          this.novaGroupImgPath = imagesContext(`./novaGroup/${novaGroup}${imagesExt}`);
        }).catch((error) => {
          alert(JSON.stringify(error));
          console.log(error);
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
