<template>
  <div class="productInfo">
    <div class="productData">
      <b-card no-body class="productCard">
        <b-media>
          <template v-slot:aside>
            <!-- localize the alt -->
            <img v-bind:src="imgPath" alt="Product Image">
          </template>
          <p>{{ productName }}</p>
          <p>{{ productVendor }}</p>
          <p>{{ productPortion }} g</p>
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
            <div>
              <p>
                <label for="qty"> {{ $t('portion') }} </label>
                <input
                  id="qty"
                  v-model="qty"
                >
              </p>
            </div>
            <b-table striped hover :fields="nutritionTableFields" :items="nutritionTableItems">
              <!-- A custom formatted header cell for field 'nutriFactLocalized' -->
              <template v-slot:head(nutriFactLocalized)="data">
                {{ $t('nutriFacts') }}
              </template>
              <!-- A virtual column for computing the localization of the word -->
              <template v-slot:cell(nutriFactLocalized)="data">
                {{ $t(data.item.nutriFact) }}
              </template>
              <!-- A custom formatted header cell for field 'value'
              TODO PARSE INT AND TRIM
               -->
              <template v-slot:head(value)="data">
                Per {{ qty }} g
              </template>
              <!-- A virtual column for computing the quantity
              according to the portion inserted by the user -->
              <template v-slot:cell(value)="data">
                {{ ((data.item.for100g * qty / 100) || 0).toFixed(2) + ' ' + data.item.unit }}
              </template>
            </b-table>
          </div>
        </b-tab>
        <b-tab :title="$t('tab_ingredients_title')">
          <b-img center :src="novaGroupImgPath" alt="Nova group image"></b-img>
          <span> Ingredients: {{ ingredientsText }}
          </span>
        </b-tab>
      </b-tabs>
      <b-button v-on:click="inputMode = 'SELECT'">Scan another product</b-button>
      <b-button v-if="mealName && mealDate"
                v-on:click="insertProductInMeal()">
        Add product to "{{mealName}}"</b-button>
    </div>
    <b-modal id="modal-error" centered ok-only title="Error">
      <p class="my-4">Product not found!</p>
    </b-modal>
  </div>
</template>

<script>
import Quagga from 'quagga';

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
      // TODO add control to verify that ean is indeed in number format
      ean: productIDTest,
      inputMode: 'SELECT',
      productShowing: false,
      status: 0,

      mealName: '',
      mealDate: '',
      // OFF API values (factorize!)
      imgPath: '',
      productName: '',
      productVendor: '',
      productPortion: '',
      nutriScore: '',
      nutriScoreImgPath: '',
      novaGroupImgPath: '',

      fatLvl: '',
      satFatLvl: '',
      sugarLvl: '',
      saltLvl: '',

      fatLvlImgPath: '',
      satFatLvlImgPath: '',
      sugarLvlImgPath: '',
      saltLvlImgPath: '',

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

      nutritionTableFields: [
        { key: 'nutriFactLocalized', label: 'Nutritional fact' },
        { key: 'value', label: 'For 100 g' },
      ],
      nutritionTableItems: [
        // { nutrition_fact: 'stonks', for_100g: 0 },
      ],

      qty: 100,
      ingredientsText: '',

      streamActive: false,
      readerSize: {
        width: 640,
        height: 480,
      },
      aspectRatio: { min: 1, max: 2 },
      detecteds: [],

      eanOptions: [
        { value: '737628064502', text: 'Noodles' },
        { value: '20969578', text: 'Sbrisolona' },
        { value: '8001300240785', text: 'Tonno' },
        { value: '5411188110835', text: 'Latte' },
        { value: '4104420208629', text: 'Spaghetti' },
        { value: '3560070240258', text: 'Chips' },
        { value: '8001300500773', text: 'Lievito' },
      ],
    };
  },
  mounted() {
    this.mealName = this.$route.query.mealName || '';
    this.mealDate = this.$route.query.date || '';
    this.ean = this.$route.query.ean || '';
    console.log(`Mounted ProductInfo. EAN: ${this.ean} Meal: ${this.mealName} Date: ${this.mealDate}`);
    // this.submitEan();
    const product = JSON.parse(localStorage.getItem('product'));
    console.log(product);
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

          if (!this.status) {
            this.productNotFound();
            return;
          }

          this.productShowing = this.status;
          // Copying response.data.product
          const { product } = response.data;

          // PRODUCT CARD
          this.imgPath = product.image_thumb_url.replace('100.jpg', 'full.jpg');
          this.productName = product.product_name;
          // Alternatively in response.data.brands
          // Absurd way to access brands_tags[0]
          [this.productVendor] = product.brands_tags;
          this.productPortion = product.product_quantity;

          // NUTRITION TAB
          this.nutriScore = response.data.product.nutriscore_grade;
          this.nutriScoreImgPath = imagesContext(`./nutriScore/${this.nutriScore}${imagesExt}`);

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

          const fatUnit = product.nutriments.fat_unit || '';
          const saturatedFatUnit = product.nutriments['saturated-fat_unit'] || '';
          const sugarUnit = product.nutriments.sugars_unit || '';
          const saltUnit = product.nutriments.salt_unit || '';
          const energyKjUnit = product.nutriments['energy-kj_unit'] || '';
          const energyKcalUnit = product.nutriments['energy-kcal_unit'] || '';
          const carbohydratesUnit = product.nutriments.carbohydrates_unit || '';
          const proteinsUnit = product.nutriments.proteins_unit || '';
          const sodiumUnit = product.nutriments.sodium_unit || '';
          const fiberUnit = product.nutriments.fiber_unit || '';

          this.nutritionTableItems.push({ nutriFact: 'energyKj', for100g: this.energyKj, unit: energyKjUnit });
          this.nutritionTableItems.push({ nutriFact: 'energyKcal', for100g: this.energyKcal, unit: energyKcalUnit });
          this.nutritionTableItems.push({ nutriFact: 'fat', for100g: this.fat, unit: fatUnit });
          this.nutritionTableItems.push({ nutriFact: 'saturatedFat', for100g: this.saturatedFat, unit: saturatedFatUnit });
          this.nutritionTableItems.push({ nutriFact: 'carbohydrates', for100g: this.carbohydrates, unit: carbohydratesUnit });
          this.nutritionTableItems.push({ nutriFact: 'sugar', for100g: this.sugar, unit: sugarUnit });
          this.nutritionTableItems.push({ nutriFact: 'salt', for100g: this.salt, unit: saltUnit });
          this.nutritionTableItems.push({ nutriFact: 'sodium', for100g: this.sodium, unit: sodiumUnit });
          this.nutritionTableItems.push({ nutriFact: 'proteins', for100g: this.proteins, unit: proteinsUnit });
          this.nutritionTableItems.push({ nutriFact: 'fiber', for100g: this.fiber, unit: fiberUnit });

          this.fatLvlImgPath = imagesContext(`./nutrientLevels/${this.fatLvl}${imagesExt}`);
          this.satFatLvlImgPath = imagesContext(`./nutrientLevels/${this.satFatLvl}${imagesExt}`);
          this.sugarLvlImgPath = imagesContext(`./nutrientLevels/${this.sugarLvl}${imagesExt}`);
          this.saltLvlImgPath = imagesContext(`./nutrientLevels/${this.saltLvl}${imagesExt}`);

          // INGREDIENTS TAB
          const novaGroup = product.nova_group;
          // TODO use placeholder if nova score is missing
          this.novaGroupImgPath = novaGroup ? imagesContext(`./novaGroup/${novaGroup}${imagesExt}`) : '';

          const { ingredients } = product;
          const ingredientsTexts = [];
          console.log(ingredients);

          Object.values(ingredients).forEach((i) => {
            if (!Object.prototype.hasOwnProperty.call(i, 'has_sub_ingredients')) {
              console.log(i.text.toLowerCase());
              ingredientsTexts.push(i.text.toLowerCase());
            }
          });
          this.ingredientsText = ingredientsTexts.join(', ');
          console.log(this.ingredientsText);
          this.inputMode = 'DONE';
        }).catch((error) => {
          alert(JSON.stringify(error));
          console.log(error);
        });
    },
    productNotFound() {
      this.$bvModal.show('modal-error');
      this.inputMode = 'SELECT';
    },
    barcodeDetected(data) {
      console.log('detected', data);

      console.log(data.codeResult.code.trim());
      console.log(data.codeResult.code.trim().length);

      if (Object.prototype.hasOwnProperty.call(data, 'codeResult')
       && Object.prototype.hasOwnProperty.call(data.codeResult, 'code')
       && (data.codeResult.code.trim().length === 13 || data.codeResult.code.trim().length === 8)) {
        alert(data.codeResult.code);
        Quagga.stop();
        this.ean = data.codeResult.code.trim();
        this.submitEan();
      }
    },
    insertProductInMeal() {
      // console.log(this.$route.query);
      console.log(`${this.mealName} ${this.mealDate}`);
      // Creation of the new product
      const body = {
        code: this.ean,
        product_name: this.productName,
        image_url: this.imgPath,
        quantity: '',
        brands: this.productVendor,
        ingredients_text: this.ingredientsText,
        traces: '',
        serving_size: this.productPortion,
        allergens: '',
        energy_100g: this.energyKcal,
        carbohydrates_100g: this.carbohydrates,
        sugars_100g: this.sugar,
        fat_100g: this.fat,
        saturated_fat_100g: this.saturatedFat,
        proteins_100g: this.proteins,
        fiber_100g: this.fiber,
        salt_100g: this.salt,
        sodium_100g: this.sodium,
        alcohol_100g: 0,
        calcium_100g: 0,
        nutrition_score_uk_100g: this.nutriScore,
        carbon_footprint_100g: 0,
        water_footprint_100g: 0,
      };
      this.$store.state.http.post('api/product', body)
        .then((response) => {
          console.log('Product created!');
          console.log(response);

          // Insertion of the new product into the meal
          const body2 = {
            mealName: this.mealName,
            components: {
              barcode: Number(this.ean),
              quantity: this.qty,
            },
            timestamp: this.mealDate,
          };
          console.log('Adding product to meal');
          console.log(body2);

          this.$store.state.http.put(`api/meals/${body2.mealName}/${body2.timestamp}/components`, body2)
            .then((response2) => {
              console.log('Product added to meal!');
              console.log(response2);
              this.$router.push({ path: '/meals', query: { date: this.mealDate } });
              // TODO refactor with AWAIT
            })
            .catch((error) => {
              console.log('Failed to add product to meal');
              console.log(error);
            });
        })
        .catch((error) => {
          console.log('Failed to create product');
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
    "tab_ingredients_title" : "Ingredients",
    "energyKj" : "Energy (Kj)",
    "energyKcal" : "Energy (Kcal)",
    "fat" : "Fat",
    "saturatedFat" : "Saturated fats",
    "carbohydrates" : "Carbohydrates",
    "sugar" : "Sugar",
    "salt" : "Salt",
    "sodium" : "Sodium",
    "proteins" : "Proteins",
    "fiber" : "Fiber",
    "nutriFacts": "Nutritional facts",
    "portion": "Portion"
  },
  "it": {
    "tab_nutrition_title" : "Valori nutrizionali",
    "tab_ingredients_title" : "Ingredienti",
    "energyKj" : "Energia (Kj)",
    "energyKcal" : "Energia (Kcal)",
    "fat" : "Grassi",
    "saturatedFat" : "Grassi saturi",
    "carbohydrates" : "Carboidrati",
    "sugar" : "Zuccheri",
    "salt" : "Sale",
    "sodium" : "Sodio",
    "proteins" : "Proteine",
    "fiber" : "Fibre",
    "nutriFacts": "Composizione",
    "portion": "Porzione"
  }
}
</i18n>

<style lang="sass">
  @import './ProductInfo.sass';
</style>
