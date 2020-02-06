<template>
  <div>
    <b-modal
      id="modal-error"
      :title="Title"
      centered
      hide-footer>
      <div>
        <img src="../../assets/restrictionShield.png" alt="errorImg">
        <span>
          {{Text}}
        </span>
      </div>
      <b-button class="mt-3" block @click="defaultCB">{{ $t('closeBtn')}}</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalError',
  data() {
    return {
      Title: this.$i18n.t('DefaultTitle'),
      Text: this.$i18n.t('DefaultText'),
      CB: undefined,
    };
  },
  created() {
    this.$root.$on('openModalError', (title, text, cb) => {
      this.Title = title !== undefined ? this.$i18n.t(title) : this.$i18n.t('DefaultTitle');
      this.Text = text !== undefined ? this.$i18n.t(text) : this.$i18n.t('DefaultText');
      this.CB = cb;
      this.$bvModal.show('modal-error');
    });
  },
  methods: {
    defaultCB() {
      this.$bvModal.hide('modal-error');
      if (this.CB !== undefined) {
        this.CB();
      }
    },
  },
};
</script>

<i18n src='../../locales/errorMessages.json'></i18n>
<i18n>
{
  "en":{
    "DefaultTitle": "Error!",
    "DefaultText": "Something went wrong, sorry",
    "closeBtn": "Ok"

  },
  "it":{
    "DefaultTitle": "Errore!",
    "DefaultText": "Qualcosa è andato storto, mi dispiace",
    "closeBtn": "Ok"
  }
}
</i18n>

<style lang="sass">
  @import './ModalError.sass'
</style>
