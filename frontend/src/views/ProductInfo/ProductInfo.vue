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
          <p>{{ productQuantityDisplay }}</p>
        </b-media>
      </b-card>
      <div class="containerProd">
        <b-tabs content-class="mt-3" justified id="myTabContent">
          <b-tab class="tab-content-info" :title="$t('tab_nutrition_title')" active>
            <div class="firstInfo">
              <b-img v-if="nutriScore" center :src="nutriScoreImgPath" alt="Nutri score image">
              </b-img>
              <!-- use vue slots to dynamically generate the table
                  with img path inside the rows -->
              <!--
              <div id="nutrientLevels">
                <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
                <span> 8.97 g Fat in moderate quantity </span>
                <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
                <span> 8.97 g Fat in moderate quantity </span>
              </div>
              -->
              <div v-if="fatLvl" class="nutritionIndicators">
                <table>
                  <tr>
                    <td>
                      <b-img center :src="fatLvlImgPath" alt="Fat level indicator"></b-img>
                    </td>
                    <td class="infoNutrTable">
                      {{ fat }} g Fat in {{ fatLvl }} quantity
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b-img center :src="satFatLvlImgPath" alt="Fat level indicator"></b-img>
                    </td>
                    <td class="infoNutrTable">
                      {{ saturatedFat }} g Saturated fat in {{ satFatLvl }} quantity
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b-img center :src="sugarLvlImgPath" alt="Fat level indicator"></b-img>
                    </td>
                    <td class="infoNutrTable">
                      {{ sugar }} g Sugar in {{ sugarLvl }} quantity
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b-img center :src="saltLvlImgPath" alt="Fat level indicator"></b-img>
                    </td>
                    <td class="infoNutrTable">
                      {{ salt }} g Salt in {{ saltLvl }} quantity
                    </td>
                  </tr>

                </table>
              </div>
            </div>
            <div class="nutritionTable">
              <div class="portion">

                  <b-input-group size="lg"
                    :prepend="$t('portion')" :append="productBaseUnitMeasure">
                    <b-form-input
                     id="qty-input"
                     type="number"
                     v-model="qty"
                      aria-describedby="qty-input-help qty-input-feedback"
                      :placeholder="$t('qty_input_placeholder')">
                    </b-form-input>
                    <b-form-invalid-feedback id="qty-input-feedback">
                      {{ $t('qty_input_desc') }}
                    </b-form-invalid-feedback>
                  </b-input-group>

              </div>
              <b-table class="tableNutri" striped hover :fields="nutritionTableFields"
              :items="nutritionTableItems">
                <!-- A custom formatted header cell for field 'nutriFactLocalized' -->
                <template class="headerTable" v-slot:head(nutriFactLocalized)="data">
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
                  Per {{ qty }} {{ productBaseUnitMeasure }}
                </template>
                <!-- A virtual column for computing the quantity
                according to the portion inserted by the user -->
                <template v-slot:cell(value)="data">
                  {{ ((data.item.for100g * qty / 100) || 0).toFixed(2) + ' ' + data.item.unit }}
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab class="tab-content-info"  :title="$t('tab_ingredients_title')">
            <b-img v-if="novaGroup" class="imgNova" center
            :src="novaGroupImgPath" alt="Nova group image">
            </b-img>
            <span class="ingredients"> Ingredients: {{ ingredientsText }}
            </span>
          </b-tab>
        </b-tabs>
      </div>
      <b-button v-on:click="scanAnother()">Scan another product</b-button>
      <b-button v-if="mealName && mealDate"
                v-on:click="insertProductInMeal()">
        Add product to "{{mealName}}"</b-button>
    </div>
  </div>
</template>

<script>
const seedrandom = require('seedrandom');

const imagesContext = require.context('@/assets/productInfo/', true, /\.svg$/);
const imagesExt = '.svg';
const productIDTest = '737628064502';
const calToJ = 4.184;
const maxCo2 = 30;
const maxH2o = 15;

// TODO add function to format numbers (trim decimals and add dots for thousands)

export default {
  name: 'productInfo',
  computed: {
    qtyState() {
      // eslint-disable-next-line no-restricted-globals
      return !isNaN(this.qty);
    },
  },
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
      productQuantityDisplay: '',
      productUnitMeasure: '',
      productBaseUnitMeasure: '',
      nutriScore: '',
      nutriScoreImgPath: '',
      novaGroup: '',
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

      carbon_footprint_100g: 0,
      water_footprint_100g: 0,

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

    };
  },
  created() {
    this.initializeContent();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.initializeContent();
  },
  methods: {
    initializeContent() {
      this.mealName = this.$route.query.mealName || '';
      this.mealDate = this.$route.query.date || '';
      this.ean = this.$route.query.ean || '';
      if (!sessionStorage[this.ean]) {
        console.log('Routing to ad InfoProd not previously loaded. Redirecting home...');
        this.$router.push('/');
        return;
      }
      const product = JSON.parse(sessionStorage.getItem(this.ean));
      // console.log(`Init InfoProd. EAN:${this.ean} Meal:${this.mealName} Date:${this.mealDate}`);
      // console.log(`SessionStorage contains: ${product.ean} : ${product.product_name}`);
      const storageEan = product.ean;
      if (this.ean !== storageEan) console.log('Inconsistency between localstorage and querystring!');
      this.loadProductInfo(product);
    },
    loadProductInfo(product) {
      // PRODUCT CARD
      this.imgPath = product.image_thumb_url.replace('100.jpg', 'full.jpg');
      this.productName = product.product_name;
      // Alternatively in response.data.brands
      // Absurd way to access brands_tags[0]
      [this.productVendor] = product.brands_tags;
      this.productPortion = product.product_quantity;
      // The table automatically displays nutritional values for the whole qantity of the package
      // this.qty = product.product_quantity;

      this.productQuantityDisplay = product.quantity;
      const unitMeasureText = product.quantity.trim().toLowerCase();
      if (unitMeasureText.endsWith('kg')) {
        this.productUnitMeasure = 'Kg';
        this.productBaseUnitMeasure = 'g';
      } else if (unitMeasureText.endsWith('ml')) {
        this.productBaseUnitMeasure = 'ml';
      } else if (unitMeasureText.endsWith('g')) {
        this.productBaseUnitMeasure = 'g';
      } else if (unitMeasureText.endsWith('l')) {
        this.productUnitMeasure = 'L';
        this.productBaseUnitMeasure = 'ml';
      } else {
        this.productUnitMeasure = '';
        this.productBaseUnitMeasure = '';
      }

      // NUTRITION TAB
      this.nutriScore = product.nutriscore_grade || '';
      this.nutriScoreImgPath = this.nutriScore ? imagesContext(`./nutriScore/${this.nutriScore}${imagesExt}`) : '';

      // nutritional levels
      this.fatLvl = product.nutrient_levels.fat || '';
      this.satFatLvl = product.nutrient_levels['saturated-fat'] || '';
      this.sugarLvl = product.nutrient_levels.sugars || '';
      this.saltLvl = product.nutrient_levels.salt || '';

      // nutritional values
      this.fat = product.nutriments.fat_100g || 0;
      this.saturatedFat = product.nutriments['saturated-fat_100g'] || 0;
      this.sugar = product.nutriments.sugars_100g || 0;
      this.salt = product.nutriments.salt_100g || 0;

      // original values, replaced by the precalculated ones in selectProduct
      // this.energyKj = product.nutriments['energy-kj_100g'] || 0;
      // this.energyKcal = product.nutriments['energy-kcal_100g'] || 0;

      const energyKj100g = product.nutriments.energy || 0;

      this.energyKj = energyKj100g;
      this.energyKcal = energyKj100g / calToJ;

      this.carbohydrates = product.nutriments.carbohydrates_100g || 0;
      this.proteins = product.nutriments.proteins_100g || 0;
      this.sodium = product.nutriments.sodium_100g || 0;
      this.fiber = product.nutriments.fiber_100g || 0;

      const fatUnit = product.nutriments.fat_unit || '';
      const saturatedFatUnit = product.nutriments['saturated-fat_unit'] || '';
      const sugarUnit = product.nutriments.sugars_unit || '';
      const saltUnit = product.nutriments.salt_unit || '';
      // const energyKjUnit = product.nutriments['energy-kj_unit'] || '';
      // const energyKcalUnit = product.nutriments['energy-kcal_unit'] || '';
      const carbohydratesUnit = product.nutriments.carbohydrates_unit || '';
      const proteinsUnit = product.nutriments.proteins_unit || '';
      const sodiumUnit = product.nutriments.sodium_unit || '';
      const fiberUnit = product.nutriments.fiber_unit || '';

      this.nutritionTableItems = [];
      this.nutritionTableItems.push({ nutriFact: 'energyKj', for100g: this.energyKj, unit: 'Kj' });
      this.nutritionTableItems.push({ nutriFact: 'energyKcal', for100g: this.energyKcal, unit: 'Kcal' });
      this.nutritionTableItems.push({ nutriFact: 'fat', for100g: this.fat, unit: fatUnit });
      this.nutritionTableItems.push({ nutriFact: 'saturatedFat', for100g: this.saturatedFat, unit: saturatedFatUnit });
      this.nutritionTableItems.push({ nutriFact: 'carbohydrates', for100g: this.carbohydrates, unit: carbohydratesUnit });
      this.nutritionTableItems.push({ nutriFact: 'sugar', for100g: this.sugar, unit: sugarUnit });
      this.nutritionTableItems.push({ nutriFact: 'salt', for100g: this.salt, unit: saltUnit });
      this.nutritionTableItems.push({ nutriFact: 'sodium', for100g: this.sodium, unit: sodiumUnit });
      this.nutritionTableItems.push({ nutriFact: 'proteins', for100g: this.proteins, unit: proteinsUnit });
      this.nutritionTableItems.push({ nutriFact: 'fiber', for100g: this.fiber, unit: fiberUnit });

      this.fatLvlImgPath = this.fatLvl ? imagesContext(`./nutrientLevels/${this.fatLvl}${imagesExt}`) : '';
      this.satFatLvlImgPath = this.satFatLvl ? imagesContext(`./nutrientLevels/${this.satFatLvl}${imagesExt}`) : '';
      this.sugarLvlImgPath = this.sugarLvl ? imagesContext(`./nutrientLevels/${this.sugarLvl}${imagesExt}`) : '';
      this.saltLvlImgPath = this.saltLvl ? imagesContext(`./nutrientLevels/${this.saltLvl}${imagesExt}`) : '';

      // INGREDIENTS TAB
      this.novaGroup = product.nova_group || '';
      // TODO use placeholder if nova score is missing
      this.novaGroupImgPath = this.novaGroup ? imagesContext(`./novaGroup/${this.novaGroup}${imagesExt}`) : '';

      const impact = this.generateCo2H2o(this.ean, this.novaGroup);

      this.carbon_footprint_100g = impact.co2;
      this.water_footprint_100g = impact.h2o;

      const { ingredients } = product;
      const ingredientsTexts = [];

      Object.values(ingredients).forEach((i) => {
        if (!Object.prototype.hasOwnProperty.call(i, 'has_sub_ingredients')) {
          // console.log(i.text.toLowerCase());
          ingredientsTexts.push(i.text.toLowerCase());
        }
      });
      this.ingredientsText = ingredientsTexts.join(', ');
    },
    generateCo2H2o(ean, novaScore) {
      const rndGen = seedrandom(ean);
      const co2Span = maxCo2 / 4;
      const h2oSpan = maxH2o / 4;
      const novaValue = parseInt(novaScore, 10) || 4;
      return {
        co2: (co2Span * (rndGen() + novaValue - 1)),
        h2o: (h2oSpan * (rndGen() + novaValue - 1)),
      };
    },
    productNotFound() {
      this.$bvModal.show('modal-product-not-found');
      this.inputMode = 'SELECT';
    },
    insertProductInMeal() {
      // eslint-disable-next-line max-len
      // console.log(`Inserting ${this.ean} ${this.productName} in meal ${this.mealName} ${this.mealDate}`);
      // Creation of the new product
      const body = {
        code: Number(this.ean),
        product_name: this.productName,
        image_url: this.imgPath,
        quantity: Number(this.productPortion),
        brands: this.productVendor,
        ingredients_text: this.ingredientsText,
        traces: '',
        origin: '',
        packaging: '',
        serving_size: Number(this.productPortion),
        allergens: '',
        energy_kj_100g: Number(this.energyKj),
        energy_kcal_100g: Number(this.energyKcal),
        carbohydrates_100g: Number(this.carbohydrates),
        sugars_100g: Number(this.sugar),
        fat_100g: Number(this.fat),
        saturated_fat_100g: Number(this.saturatedFat),
        proteins_100g: Number(this.proteins),
        fiber_100g: Number(this.fiber),
        salt_100g: Number(this.salt),
        sodium_100g: Number(this.sodium),
        alcohol_100g: Number(0),
        calcium_100g: Number(0),
        nutrition_score_uk_100g: this.nutriScore,
        nova_group: this.nova_group,
        carbon_footprint_100g: Number(this.carbon_footprint_100g),
        water_footprint_100g: Number(this.water_footprint_100g),
        measure_unit: this.productBaseUnitMeasure,
      };
      /* eslint-disable no-unused-vars */
      this.$store.state.http.post('api/product', body)
        .then((response) => {
          // console.log('Product created!');
          // console.log(response);

          // Insertion of the new product into the meal
          const body2 = {
            mealName: this.mealName,
            components: {
              barcode: Number(this.ean),
              quantity: Number(this.qty),
            },
            timestamp: this.mealDate,
          };
          // console.log('Adding product to meal');
          // console.log(body2);

          this.$store.state.http.put(`api/meals/${body2.mealName}/${body2.timestamp}/components`, body2)
            .then((response2) => {
              // console.log('Product added to meal!');
              // console.log(response2);
              this.$router.push({ path: '/meals', query: { date: this.mealDate } });
              // TODO refactor with AWAIT
            })
            .catch((error) => {
              // console.log('Failed to add product to meal');
              // console.log(error);
            });
        })
        .catch((error) => {
          // console.log('Failed to create product');
          // console.log(error);
        });
      /* eslint-enable no-unused-vars */
    },
    scanAnother() {
      this.$root.$emit('openProductSelection', this.mealName, this.mealDate);
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
    "nutriFacts" : "Nutritional facts",
    "portion" : "Portion",
    "qty_input_desc" : "Insert a number.",
    "qty_input_placeholder" : "The portion consumed"
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
    "portion": "Porzione",
    "qty_input_desc" : "Inserisci un numero.",
    "qty_input_placeholder" : "La porzione consumata"
  }
}
</i18n>

<style lang="sass">
  @import './ProductInfo.sass';
</style>
