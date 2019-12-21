<template>
  <div class="registration">
    <b-card title="Registrazione">
      <b-form @submit="onSubmit" class="formIns">
        <b-form-group
          id="input-group-username"
          label="Username:"
          label-for="input-username"
        >
          <b-form-input
            id="input-username"
            v-model="form.username.value"
            required
            placeholder="Inserisci username"
          ></b-form-input>
        </b-form-group>
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
          <b-form-input
            id="re-input-password"
            v-model="form.repassword"
            type="password"
            required
            placeholder="Ripeti password"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-personal"
          label="Dati personali:"
          label-for="input-name"
        >
          <b-form-input
            id="input-name"
            v-model="form.name.value"
            required
            placeholder="Inserisci nome"
          ></b-form-input>
          <b-form-input
            id="input-surname"
            v-model="form.surname.value"
            required
            placeholder="Inserisci cognome"
          ></b-form-input>
          <b-form-input
            id="input-height"
            v-model="form.height.value"
            required
            placeholder="Inserisci altezza"
          ></b-form-input>
          <b-form-input
            id="input-weight"
            v-model="form.weight.value"
            required
            placeholder="Inserisci peso"
          ></b-form-input>
          <b-form-input
            id="input-allergens"
            v-model="form.allergens.value"
            required
            placeholder="Inserisci allergeni"
            aria-describedby="allergens-help-block"
          ></b-form-input>
          <b-form-text id="allergens-help-block">
            Gli allergeni devono essere separati da spazio.
          </b-form-text>
          <!--<b-form-input
            id="input-sex"
            v-model="form.sex"
            required
            placeholder="Inserisci sesso"
          ></b-form-input>-->
          <b-form-select v-model="form.sex">
            <option disabled value=""> {{ $t(`${form.sex.key}`) }}</option>
            <option v-for="opt in form.sex.ar"
            v-bind:key="opt" v-bind:value="opt">
              {{ opt.toUpperCase() }}
            </option>
          </b-form-select>
        </b-form-group>
        <div class="text-center">
          <b-button type="submit" variant="primary">Registrami</b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'registration',
  data() {
    return {
      form: {
        email: '',
        password: '',
        repassword: '',
        username: {
          key: 'username',
          value: '',
          placeholder: 'Enter your username',
        },
        name: {
          key: 'name',
          value: '',
          placeholder: 'Enter your name',
        },
        surname: {
          key: 'surname',
          value: '',
          placeholder: 'Enter your surname',
        },
        height: {
          key: 'height',
          value: '',
          placeholder: 'Enter your height',
        },
        weight: {
          key: 'weight',
          value: '',
          placeholder: 'Enter your weight',
        },
        dateOfBirth: '',
        sex: {
          key: 'gender',
          value: '',
          ar: ['m', 'f'],
        },
        img: '',
        allergens: {
          key: 'allergens',
          value: '',
          placeholder: 'Enter your allergens',
        },
      },
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
    },
  },
};
</script>

<style lang="scss">
</style>
