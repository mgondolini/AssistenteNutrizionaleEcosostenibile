<template>
  <div class="login">
    <b-form @submit="onSubmit">
      <p class="h4 text-center">Sign in</p>
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
        <b-button type="submit" variant="primary">Submit</b-button>
      </div>
    </b-form>
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
      alert(JSON.stringify(this.form));
    },
  },
};
</script>
<style>
  .login{
    margin: 10% auto;
    width: 50%;
    display: flex;
  }
</style>
