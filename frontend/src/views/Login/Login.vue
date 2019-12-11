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
              Non condivideremo mai la tua email con parti terze.
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
              La password deve avere lunghezza compresa tra 8 e 20 caratteri, può contenere
              lettere e numeri ma non può contenere spazi bianchi, caratteri speciali o emoji.
            </b-form-text>
          </b-form-group>
        </div>
        <div class="text-center">
          <b-button type="submit" variant="primary">Login</b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
const axios = require('axios');
const config = require('../../../config.json');

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

      axios.post(config.server.concat('api/auth'), { email: mail, key: psw })
        .then((response) => {
          localStorage.ecoAssToken = response.data.token.toString();
          global.login(response.data.token.toString(), true);
          this.$router.push('/last_meals');
        }).catch((error) => {
          // TODO manage error getting public key
          console.log('Error during authentication: '.concat(error));
        });
      /*
      ESEMPIO chiamata get con token
      this.$server.get('api/publickey')
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
<style lang="scss">
  @import './login.scss';
</style>
