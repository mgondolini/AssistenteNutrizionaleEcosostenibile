<template>
  <div class="registration">
    <b-card class="cardRegistration" title="Registrazione">
      <b-form @submit="onSubmit" class="formIns">
        <div class="container-first-step">
          <div class="container-form">
            <b-form-group
              id="input-group-username"
              label="Username:"
              label-for="input-username"
            >
              <b-form-input
                id="input-username"
                v-model="form.username"
                required
                @focusout="onBlurUser"
                placeholder="Inserisci username"
                aria-describedby="user-help-block"
              ></b-form-input>
              <b-form-text id="user-help-block">
                {{ $t('username') }}
              </b-form-text>
            </b-form-group>
          </div>
          <div class="container-form ">
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
                @focusout="onBlurEmail"
                placeholder="Inserisci email"
                aria-describedby="email-help-block"
              ></b-form-input>
              <b-form-text id="email-help-block">
                {{ $t('mail') }}
              </b-form-text>
            </b-form-group>
          </div>
          <div class="container-form">
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
                @focusout="onBlurPsw"
                placeholder="Inserisci password"
                aria-describedby="password-help-block"
              ></b-form-input>
              <b-form-text id="password-help-block">
                  {{ $t('pwd') }}
              </b-form-text>
            </b-form-group>
          </div>
          <div class="container-form">
            <b-form-group
              id="input-group-password"
              label="Ripeti password:"
              label-for="re-input-password"
            >
              <b-form-input
                id="re-input-password"
                v-model="form.password"
                type="password"
                required
                @focusout="onBlurPsw"
                placeholder="Inserisci password"
                aria-describedby="password-help-block"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>


        <b-form-group
          id="input-group-personal"
          label="Dati personali:"
          label-for="input-name"
        >
          <div class="pippo">
            <label for="input-name">Name:</label>
            <b-form-input
              id="input-name"
              v-model="form.name"
              required
              placeholder="Inserisci nome"
            ></b-form-input>
          </div>
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
            type="number"
            v-model="form.height"
            required
            placeholder="Inserisci altezza"
          ></b-form-input>
          <label for="input-weight">Weight:</label>
          <b-form-input
            id="input-weight"
            type="number"
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
          <b-form-select id="input-sex" required v-model="form.sex.value">
            <option disabled value=""> {{ form.sex.key }}</option>
            <option v-for="opt in form.sex.ar"
              :key="opt" :value="opt">
              {{ opt.toUpperCase() }}
            </option>
          </b-form-select>
          <label>Date of Birth:</label>
          <date-picker name="date" required v-model="form.dateOfBirth"
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
        height: 170,
        weight: 70,
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
        format: 'YYYY/MM/DD',
        useCurrent: false,
        showClear: false,
        showClose: true,
      },
      correctUser: false,
      correctEmail: false,
      correctPsw: false,
      correctRePsw: false,
    };
  },
  components: {
    datePicker,
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      // this.correctEmail && this.correctPsw && this.correctRePsw && this.correctUser
      if (this.correctEmail && this.correctPsw && this.correctRePsw && this.correctUser) {
        const b = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
          surname: this.form.surname,
          birth_date: this.form.dateOfBirth,
          sex: this.form.sex.value,
          weight: this.form.weight,
          height: this.form.height,
          allergens: this.form.allergens,
        };
        this.$store.state.http.post('api/user', b).then((res) => {
          console.log(res);
          this.$store.state.http.post('api/auth', { email: this.form.email, key: this.form.password })
            .then((response) => {
              localStorage.ecoAssToken = response.data.token.toString();
              this.$store.commit('login', response.data.token.toString());
              this.$router.push('/meals');
            }).catch((error) => {
              // TODO manage error getting public key
              console.log('Error during authentication: '.concat(error));
            });
        }).catch((err) => {
          console.log(err);
        });
      } else {
        console.log('Wrong data!');
      }
    },
    onBlurUser() {
      // check if User already exist
      const u = this.form.username;
      if (/[^a-z|\u002D|0-9]/i.test(u) || u.length === 0) {
        // invalid username
        this.correctUser = false;
        document.getElementById('input-username').className = 'form-control regUserError';
      } else {
        this.$store.state.http.get(`api/checkUser/${u}`).then((response) => {
          if (!response.data.match('ok')) {
            this.correctUser = false;
            // invalid user
            document.getElementById('input-username').className = 'form-control regUserError';
          } else {
            this.correctUser = true;
            document.getElementById('input-username').className = 'form-control';
          }
        }).catch((error) => {
          // something wrong
          console.log(error);
        });
      }
    },
    onBlurEmail() {
      // check if Email already exist
      const e = this.form.email.trim();
      if (e.length !== 0) {
        this.$store.state.http.get(`api/checkEmail/${e}`).then((resp) => {
          if (!resp.data.match('ok')) {
            // invalid email
            this.correctEmail = false;
            document.getElementById('input-email').className = 'form-control regEmailError';
            console.log('Wrong email');
          } else {
            this.correctEmail = true;
            document.getElementById('input-email').className = 'form-control';
          }
        }).catch((error) => {
          // something wrong
          console.log(error);
        });
      } else {
        this.correctEmail = false;
        document.getElementById('input-email').className = 'form-control regEmailError';
      }
    },
    onBlurPsw() {
      const p = this.form.password;
      this.correctPsw = true;
      document.getElementById('input-password').className = 'form-control';
      // check psw: length 8--20, no-space
      if (p.length < 8 || p.length > 20 || /\s/.test(p)) {
        // invalid psw
        this.correctPsw = false;
        document.getElementById('input-password').className = 'form-control regPswError';
      }
    },
    onBlurRePsw() {
      // check repsw
      const p = this.form.password;
      const rp = this.form.repassword;
      this.correctRePsw = true;
      document.getElementById('re-input-password').className = 'form-control';
      if (!p.match(rp)) {
        // repsw no match
        this.correctRePsw = false;
        document.getElementById('re-input-password').className = 'form-control regRePswError';
      }
    },
  },
};
</script>

<i18n>
{
  "en": {
    "username": "Select a username!",
    "mail": "We won't share your email with third party",
    "pwd": "The password must be between 8 and 20 characters long"
  },
  "it": {
    "username": "Scegli un username univoco!",
    "mail": "Non condivideremo mai la tu email con terze parti",
    "pwd": "La password deve avere lunghezza compresa tra 8 e 20 caratteri"

  }
}
</i18n>

<style lang="sass">
  @import './registration'
</style>
