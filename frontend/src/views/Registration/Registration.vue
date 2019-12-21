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
            v-model="form.username"
            required
            :blur="onBlurUser"
            placeholder="Inserisci username"
            aria-describedby="user-help-block"
          ></b-form-input>
          <b-form-text id="user-help-block">
            Scegli un username univoco!
          </b-form-text>
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
            :blur="onBlurPsw"
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
            :blur="onBlurRePsw"
            placeholder="Ripeti password"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-personal"
          label="Dati personali:"
          label-for="input-name"
        >
          <label for="input-name">Name:</label>
          <b-form-input
            id="input-name"
            v-model="form.name"
            required
            placeholder="Inserisci nome"
          ></b-form-input>
          <label for="input-surname">Surame:</label>
          <b-form-input
            id="input-surname"
            v-model="form.surname"
            required
            placeholder="Inserisci cognome"
          ></b-form-input>
          <label for="input-height">Height:</label>
          <b-form-input
            id="input-height"
            v-model="form.height"
            required
            placeholder="Inserisci altezza"
          ></b-form-input>
          <label for="input-weight">Weight:</label>
          <b-form-input
            id="input-weight"
            v-model="form.weight"
            required
            placeholder="Inserisci peso"
          ></b-form-input>
          <label for="input-allergens">Allergens:</label>
          <b-form-input
            id="input-allergens"
            v-model="form.allergens"
            placeholder="Inserisci allergeni"
            aria-describedby="allergens-help-block"
          ></b-form-input>
          <b-form-text id="allergens-help-block">
            Gli allergeni devono essere separati da spazio.
          </b-form-text>
          <label>Sex:</label>
          <b-form-select required v-model="form.sex">
            <option disabled value=""> {{ $t(`${form.sex.key}`) }}</option>
            <option v-for="opt in form.sex.ar"
              v-bind:key="opt" v-bind:value="opt">
              {{ opt.toUpperCase() }}
            </option>
          </b-form-select>
          <label>Date of Birth:</label>
          <date-picker name="date" v-model="form.dateOfBirth"
            :config="options"></date-picker>
        </b-form-group>
        <div class="text-center">
          <b-button type="submit" variant="primary">Registrami</b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker';

export default {
  name: 'registration',
  data() {
    return {
      form: {
        email: '',
        password: '',
        repassword: '',
        username: '',
        name: '',
        surname: '',
        height: '',
        weight: '',
        dateOfBirth: '',
        sex: {
          key: 'gender',
          value: '',
          ar: ['m', 'f'],
        },
        img: '',
        allergens: '',
      },
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: false,
        showClear: false,
        showClose: true,
      },
    };
  },
  components: {
    datePicker,
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
    },
    onBlurUser() {
      // check in User already exist
    },
    onBlurPsw() {
      // check psw
    },
    onBlurRePsw() {
      // check repsw
    },
  },
};
</script>

<style lang="scss">
</style>
