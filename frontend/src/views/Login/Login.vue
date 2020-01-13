<template>
  <div class="login">
    <b-card
      title="Il tuo Assistente Nutrizionale"
      img-alt="Image"
      img-top
      tag="article"
      class="cardLogin"
    >
      <img class="loginImg" src="../../assets/ecology.png"/>
      <b-form @submit="onSubmit" class="formIns">
        <div class="grey-text">
          <b-form-group
            id="input-group-email"
            label="Email:"
            label-for="input-email"
          >
            <b-form-input
              id="input-email"
              v-model="form.email"
              type="email"
              required
              placeholder="Inserisci email"
              aria-describedby="email-help-block"
            ></b-form-input>
            <b-form-text id="email-help-block">
              {{ $t('info') }}
            </b-form-text>
          </b-form-group>
          <b-form-group
            id="input-group-password"
            label="Password:"
            label-for="input-password"
          >
            <b-form-input
              id="input-password"
              v-model="form.password"
              type="password"
              required
              placeholder="Inserisci password"
              aria-describedby="password-help-block"
            ></b-form-input>
            <b-form-text id="password-help-block">
              {{ $t('info-psw') }}
            </b-form-text>
          </b-form-group>
        </div>
        <div class="text-center">
          <b-button class="sum-button button1" type="submit">Login</b-button>
        </div>
      </b-form>
      <hr />
      <label style="margin-right: 10px">{{ $t('not-reg') }}</label>
      <b-button class="sum-button button1">{{ $t('reg') }}</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      const mail = this.form.email;
      const psw = this.form.password;

      this.$store.state.http.post('api/auth', { email: mail, key: psw })
        .then((response) => {
          localStorage.ecoAssToken = response.data.token.toString();
          this.$store.commit('login', response.data.token.toString());
          this.$router.push('/meals');
        }).catch((error) => {
          // TODO manage error getting public key
          console.log('Error during authentication: '.concat(error));
        });
      /*
      ESEMPIO chiamata get con token
      this.$store.state.http.get('api/publickey')
        .then((resp) => {
          console.log('Ok!');
        }).catch((er) => {
          console.log('Error');
        });
      */
    },
  },
};
</script>

<i18n>
{
  "en": {
    "info": "We never share your email with third parties.",
    "info-psw": "Password must be 8 to 20 characters long. It can not contains spaces.",
    "not-reg": "Not registered?",
    "reg": "Sign in"
  },
  "it": {
    "info": " Non condivideremo mai la tua email con parti terze.",
    "info-psw": "La password deve essere lunga tra 8 e 20 caratteri. Non può contenere spazi.",
    "not-reg":"Non sei ancora registrato?",
    "reg": "Registrati"
  }
}
</i18n>
<style lang="scss">
  @import './login.scss';
</style>
