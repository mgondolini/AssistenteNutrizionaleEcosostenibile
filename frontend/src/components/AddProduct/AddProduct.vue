<template>
  <b-modal
    id="modal-addProduct"
    title="Lookup modes"
    centered
    hide-footer
    @close="inputMode = 'SELECT'"
    @hide="inputMode = 'SELECT'"
    >
    <div v-if="inputMode === 'SELECT'" class="buttonContainerVertical">
        <b-button v-on:click="inputMode = 'MANUAL'">Manual insert</b-button>
        <b-button v-on:click="inputMode = 'STREAM'">Scan barcode</b-button>
        <b-button v-on:click="uploadFile()">Upload barcode</b-button>
        <b-button v-on:click="scanNutriTable()">Scan nutrition table</b-button>
    </div>
    <div v-else-if="inputMode === 'MANUAL'" id="insertEAN" class="buttonContainer">
      <div>
        <label for="ean">EAN code</label>
        <input
          id="ean"
          v-model="ean"
          value=""
        >
      </div>
      <b-form-select v-model="ean" :options="eanOptions"></b-form-select>
      <div>
        <b-button v-on:click="gotoProductInfo()">Lookup</b-button>
        <b-button v-on:click="inputMode = 'SELECT'">Back</b-button>
      </div>
    </div>
    <div v-else-if="inputMode === 'STREAM'" id="videoStream" class="buttonContainer">
      <barcodeScanner
        :onDetected="barcodeDetected"
        :readerSize="readerSize"
        :readerTypes="['ean_reader']"
        :aspectRatio="aspectRatio"
      ></barcodeScanner>
      <b-button v-on:click="inputMode = 'SELECT'">Back</b-button>
    </div>
  </b-modal>
</template>

<script>
// import Quagga from 'quagga';

export default {
  name: 'AddProduct',
  data() {
    return {
      inputMode: 'SELECT',
      ean: '',
      mealName: '',
      mealDate: '',

      // v-quagga props
      readerSize: {
        width: 640,
        height: 480,
      },
      aspectRatio: { min: 1, max: 100 },
      detecteds: [],

      // ean dropdown selector facility
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
  components: {
    barcodeScanner,
  },
  methods: {
    open(mealName, timestamp) {
      this.mealName = mealName;
      this.mealDate = timestamp;
      this.$bvModal.show('modal-addProduct');
    },
    gotoProductInfo() {
      this.$router.push({ path: '/info_prod', query: { ean: this.ean, mealName: this.mealName, date: this.mealDate } });
    },
    barcodeDetected(data) {
      console.log('EAN detected', data);

      console.log(data.codeResult.code.trim());
      console.log(data.codeResult.code.trim().length);

      if (Object.prototype.hasOwnProperty.call(data, 'codeResult')
       && Object.prototype.hasOwnProperty.call(data.codeResult, 'code')
       && (data.codeResult.code.trim().length === 13 || data.codeResult.code.trim().length === 8)) {
        // alert(data.codeResult.code);
        // Quagga.stop();
        this.ean = data.codeResult.code.trim();
        this.$bvModal.close('modal-addProduct');
        this.gotoProductInfo();
      }
*/
    },
  },
  mounted() {
  },
};
</script>

<i18n>
{
  "en": {

  },
  "it": {

  }
}
</i18n>

<style lang="sass">
  @import './AddProduct.sass';
</style>
