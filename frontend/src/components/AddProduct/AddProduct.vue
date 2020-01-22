<template>
  <b-modal id="modal-addProduct" title="Error" hide-footer>
    {{ mealName + " " + mealDate}}
  </b-modal>
</template>

<script>

export default {
  name: 'AddProduct',
  data() {
    return {
      mealName: '',
      mealDate: '',
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
