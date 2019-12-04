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
const crypto = require('crypto');
const config = require('../../../config.json');

console.log(crypto);
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
      // http://localhost:8081/api/publickey
      // config.server.concat('api/publickey')
      axios.get(config.server.concat('api/publickey'))
        .then((response) => {
          const buffer = Buffer.from(psw);
          // TODO publicEncrypt non funziona
          console.log(response.data.publicKey);
          const pk = crypto.createPublicKey({
            key: response.data.publicKey,
            format: 'pem',
            type: 'spki',
          });
          console.log(pk);
          const encrypted = crypto.publicEncrypt(pk, buffer);
          const enc = encrypted.toString('base64');
          axios.post(config.server.concat('api/auth/'.concat(mail)), { key: enc })
            .then((res) => {
              // TODO test if token is visible globally
              this.$token = res.token;
              alert(res.desc);
            }).catch((error) => {
              // TODO manage error generating token
              console.log('Error during login: '.concat(error));
            });
        }).catch((error) => {
          // TODO manage error getting public key
          console.log('Error getting publicKey: '.concat(error));
        });
    },
  },
};
</script>
<style lang="scss">
  @import './login.scss';
</style>
