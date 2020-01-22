<template>
  <b-modal
    id="modal-addProduct"
    title="Lookup modes"
    centered
    hide-footer
    @close="inputMode = 'SELECT'"
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
        <b-button v-on:click="submitEan()">Lookup</b-button>
        <b-button v-on:click="inputMode = 'SELECT'">Back</b-button>
      </div>
    </div>
    <div v-else-if="inputMode === 'STREAM'" id="videoStream" class="buttonContainer">
      <v-quagga
        :onDetected="barcodeDetected"
        :readerSize="readerSize"
        :readerType="'ean_reader'"
        :aspectRatio="aspectRatio"
      ></v-quagga>
      <b-button v-on:click="inputMode = 'SELECT'">Back</b-button>
    </div>
  </b-modal>
</template>

<script>
import Quagga from 'quagga';

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
      aspectRatio: { min: 1, max: 2 },
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
  methods: {
    open(mealName, timestamp) {
      this.mealName = mealName;
      this.mealDate = timestamp;
      this.$bvModal.show('modal-addProduct');
    },
    gotoProductInfo() {
      this.$router.push({ path: '/info_prod', query: { mealName: this.mealDate, date: this.mealDate } });
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
