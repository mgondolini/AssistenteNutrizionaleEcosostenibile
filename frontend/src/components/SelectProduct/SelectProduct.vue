<template>
  <b-modal
    id="modal-selectProduct"
    :title="$t('lookup_modes')"
    centered
    hide-footer
    @hidden="inputMode = 'SELECT'"
    >
    <div id="selectionInputMode">
      <div v-if="inputMode === 'SELECT'" class="buttonContainerVertical">
          <b-button v-on:click="inputMode = 'MANUAL'">{{$t('input_btn_manual')}}</b-button>
          <b-button id="buttonScanner" class="btnAR" v-on:click="toggleScannerStream">
            {{$t('input_btn_scan_barcode')}}</b-button>
          <b-button v-on:click="uploadFile()">{{$t('input_btn_upload')}}</b-button>
          <input v-show="false" type="file"
            id="barcodePicture" @change="uploadBarcodeImg" name="file" />
          <b-button v-on:click="scanNutriTable()">{{$t('input_btn_scan_nutri')}}</b-button>
      </div>
      <div v-else-if="inputMode === 'MANUAL'" id="insertEAN" class="buttonContainer">
        <div>
          <label class="eanCodeLabel" for="ean">{{$t('ean_code')}}</label>
          <input
            id="ean"
            v-model="ean"
            value=""
          >
        </div>
        <b-form-select v-model="ean" :options="eanOptions"></b-form-select>
        <div>
          <b-button v-on:click="loadProductInfo(ean)">{{$t('lookup')}}</b-button>
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
        <b-button id="btnBack" class="btnAR" v-on:click="toggleScannerStream">
          {{$t('back')}}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
const axios = require('axios');
const Quagga = require('quagga');

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
      barcodeFound: Boolean(false),
      readerQuorum: 5,

      // ean dropdown selector facility
      eanOptions: [
        { value: '737628064502', text: 'Noodles' },
        { value: '20969578', text: 'Sbrisolona' },
        { value: '8001300240785', text: 'Tonno' },
        { value: '5411188110835', text: 'Latte' },
        { value: '4104420208629', text: 'Spaghetti' },
        { value: '3560070240258', text: 'Chips' },
        { value: '8001300500773', text: 'Lievito' },
        { value: '3421557502163', text: 'Farina 1Kg' },
        { value: '3560070339587', text: 'Zucchero 1Kg' },
        { value: '3564707000055', text: 'Farina 1000g' },
        { value: '5449000000996', text: 'CocaCola 330ml' },
        { value: '5411188110835', text: 'Latte 1L' },
      ],
    };
  },
  created() {
    this.$root.$on('openProductSelection', (mealName, timestamp) => {
      this.mealName = mealName;
      this.mealDate = timestamp;
      // console.log(`Called openProdSel with: ${this.mealName} ${this.mealDate}`);
      this.openModal();
    });
    this.$root.$on('selectProduct', (ean) => {
      this.loadProductInfo(ean);
    });
    // sessionStorage.removeItem('product');
  },
  mounted() {
  },
  methods: {
    openModal() {
      this.$bvModal.show('modal-selectProduct');
    },
    gotoProductInfo() {
      // console.log(`PUSH: ${this.ean}${this.mealName}${this.mealDate}`);
      this.$router.push({ path: '/info_prod', query: { ean: this.ean, mealName: this.mealName, date: this.mealDate } });
      // Keep this AFTER the router push
      this.$bvModal.hide('modal-selectProduct');
    },
    barcodeDetected(data) {
      if (this.barcodeFound === Boolean(true)) return;

      if (Object.prototype.hasOwnProperty.call(data, 'codeResult')
       && Object.prototype.hasOwnProperty.call(data.codeResult, 'code')
       && (data.codeResult.code.trim().length === 13 || data.codeResult.code.trim().length === 8)) {
        // TODO implement major rule stabilizer
        // store only well-formatted readings (of lenght 13) in a collection
        // reached a threshold of readings stored, the most popular value is the correct ean
        // if no majority is reached, keep storing until it does

        const code = data.codeResult.code.trim();
        this.detecteds.push(code);
        // console.log(ean);
        // The array is filled with quorum elements
        if (this.detecteds.length >= this.readerQuorum) {
          this.barcodeFound = Boolean(true);
          // The most frequent is selected and popped from the array
          const ean = this.mostFrequentElement(this.detecteds);
          // console.log(this.detecteds);
          this.loadProductInfo(ean);
          this.toggleScannerStream();
        }
      }
    },
    loadProductInfo(ean) {
      console.log(`Requesting infos about ean ${ean}`);
      console.log(offApiPath + ean + offApiSuffix);
      axios.get(offApiPath + ean + offApiSuffix)
        .then((response) => {
          // console.log(response);

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
          product.ean = ean;
          this.ean = ean;
          sessionStorage.setItem(ean, JSON.stringify(product));
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
        id: 'notFound',
        centered: true,
      });
      // this.toggleScannerStream();
    },
    toggleScannerStream() {
      const x = document.getElementsByClassName('btnAR')[0].id;
      if (x === 'buttonScanner') {
        document.getElementById('selectionInputMode').classList.add('scanning');
        this.inputMode = 'STREAM';
        this.barcodeFound = false;
        this.detecteds = [];
      } else if (x === 'btnBack') {
        document.getElementById('selectionInputMode').classList.remove('scanning');
        this.inputMode = 'SELECT';
      }
    },
    mostFrequentElement(arr) {
      // Sorts and array based on a custom comparator
      // the comparator returns the element with most occurrence between two
      // pop() returns the most frequent (or the latest seen in case of a tie)
      return arr.sort((a, b) => arr.filter(v => v === a).length
            - arr.filter(v => v === b).length).pop();
    },
    uploadFile() {
      document.getElementById('barcodePicture').click();
    },
    uploadBarcodeImg(img) {
      const i = img.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(i);
      reader.onload = (image) => {
        console.log(image);
        console.log(Quagga);
        // image.target.result contiene l'immagine in base64 e può essere usata come url
        /*
        Quagga.decodeSingle({
          src: image.target.result,
          numOfWorkers: 0, // Needs to be 0 when used within node
          inputStream: {
            size: 800, // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: ['code_128_reader'], // List of active readers
          },
        }, (result) => {
          if (result.codeResult) {
            console.log('result', result.codeResult.code);
          } else {
            console.log('not detected');
          }
        });
        */
      };
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
  @import './SelectProduct.sass'
</style>
