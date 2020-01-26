<template>
  <b-modal
    id="modal-selectProduct"
    :title="$t('lookup_modes')"
    centered
    hide-footer
    @hidden="inputMode = 'SELECT'"
    >
    <div v-if="inputMode === 'SELECT'" class="buttonContainerVertical">
        <b-button v-on:click="inputMode = 'MANUAL'">{{$t('input_btn_manual')}}</b-button>
        <b-button v-on:click="inputMode = 'STREAM'">{{$t('input_btn_scan_barcode')}}</b-button>
        <b-button v-on:click="uploadFile()">{{$t('input_btn_upload')}}</b-button>
        <b-button v-on:click="scanNutriTable()">{{$t('input_btn_scan_nutri')}}</b-button>
    </div>
    <div v-else-if="inputMode === 'MANUAL'" id="insertEAN" class="buttonContainer">
      <div>
        <label for="ean">{{$t('ean_code')}}</label>
        <input
          id="ean"
          v-model="ean"
          value=""
        >
      </div>
      <b-form-select v-model="ean" :options="eanOptions"></b-form-select>
      <div>
        <b-button v-on:click="loadProductInfo()">{{$t('lookup')}}</b-button>
        <b-button v-on:click="inputMode = 'SELECT'">{{$t('back')}}</b-button>
      </div>
    </div>
    <div v-else-if="inputMode === 'STREAM'" id="videoStream" class="buttonContainer">
      <v-quagga
        :onDetected="barcodeDetected"
        :readerSize="readerSize"
        :readerTypes="['ean_reader']"
        :aspectRatio="aspectRatio"
      ></v-quagga>
      <b-button v-on:click="inputMode = 'SELECT'">{{$t('back')}}</b-button>
    </div>
  </b-modal>
</template>

<script>
// import Quagga from 'quagga';
import EventBus from '../../main';

const axios = require('axios');

const offApiPath = 'https://world.openfoodfacts.org/api/v0/product/';
const offApiSuffix = '.json';

export default {
  name: 'SelectProduct',
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
  created() {
    console.log('CREATED SELPROD');
    console.log(EventBus);
    EventBus.$on('openProductSelection', (mealName, timestamp) => {
      this.mealName = mealName;
      this.mealDate = timestamp;
      console.log(`${this.mealName} ${this.mealDate}`);
      this.openModal();
    });
  },
  mounted() {
    localStorage.removeItem('product');
  },
  methods: {
    openModal() {
      this.$bvModal.show('modal-selectProduct');
    },
    gotoProductInfo() {
      this.$router.push({ path: '/info_prod', query: { ean: this.ean, mealName: this.mealName, date: this.mealDate } });
      // Keep this AFTER the router push
      this.$bvModal.hide('modal-selectProduct');
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
        this.loadProductInfo();
      }
    },
    loadProductInfo() {
      console.log(`Requesting infos about ean ${this.ean}`);
      console.log(offApiPath + this.ean + offApiSuffix);
      axios.get(offApiPath + this.ean + offApiSuffix)
        .then((response) => {
          console.log(response);

          // Status === 1 means the product has been found
          // some random EANs can also return a status 1 so we check the code not to be empty

          const status = (response.data.status === 1)
                        && (response.data.code !== '')
                        && (Object.prototype.hasOwnProperty.call(response.data, 'product'));

          if (!status) {
            this.productNotFound();
            return;
          }

          const { product } = response.data;
          localStorage.setItem('product', JSON.stringify(product));

          this.gotoProductInfo();
        }).catch((error) => {
          console.log(error);
          this.displayError('modal_server_not_responding');
        });
    },
    productNotFound() {
      // this.$bvModal.show('modal-product-not-found');
      this.displayError('modal_prod_not_found_text');
    },
    displayError(errorTextKey) {
      this.$bvModal.msgBoxOk(this.$i18n.t(errorTextKey), {
        title: this.$i18n.t('modal_title_error'),
        okVariant: 'danger',
        centered: true,
      });
    },
  },
};
</script>

<i18n>
{
  "en": {
    "lookup_modes" : "Lookup modes",
    "input_btn_manual" : "Manual insert",
    "input_btn_scan_barcode" : "Scan barcode",
    "input_btn_upload" : "Upload barcode",
    "input_btn_scan_nutri" : "Scan nutrition table",
    "ean_code" : "EAN code",
    "lookup" : "Lookup",
    "back" : "Back",
    "modal_title_error" : "Error!",
    "modal_prod_not_found_text" : "Product not found",
    "modal_server_not_responding" : "Server not responding"
  },
  "it": {
    "lookup_modes" : "Modalità di ricerca",
    "input_btn_manual" : "Inserimento manuale",
    "input_btn_scan_barcode" : "Scansiona barcode",
    "input_btn_upload" : "Carica foto barcode",
    "input_btn_scan_nutri" : "Scansiona tabella nutrizionale",
    "ean_code" : "Codice EAN",
    "lookup" : "Cerca",
    "back" : "Indietro",
    "modal_title_error" : "Errore!",
    "modal_prod_not_found_text" : "Prodotto non trovato",
    "modal_server_not_responding" : "Il server non risponde"
  }
}
</i18n>

<style lang="sass">
  @import './SelectProduct.sass';
</style>
