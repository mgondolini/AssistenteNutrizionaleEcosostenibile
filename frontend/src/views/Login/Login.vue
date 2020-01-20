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
            <button id="buttonHideShow" title="Hold down to show password"
              @click="changeType" type = "button"></button>
            <b-form-text id="password-help-block">
              {{ $t('info-psw') }}
            </b-form-text>
          </b-form-group>
        </div>
        <div class="text-center buttonsDiv block">
          <b-button class="sim-button button1" type="submit">Login</b-button>
        </div>
      </b-form>
      <hr />
      <span style="margin-right: 10px">{{ $t('not-reg') }}</span>
      <router-link to='registration'
        class="text-center buttonsDiv" style="text-decoration:none; margin-bottom:30px;">
        <b-button class="sim-button button1">{{ $t('reg') }}</b-button>
      </router-link>
    </b-card>
    <b-modal id="modal-error" title="Error" hide-footer v-model="modalErrorShow">
      <div class="d-block text-center">
        <img src="https://img.icons8.com/color/48/000000/restriction-shield.png">
        {{ this.errorMsgModal }}
      </div>
      <b-button class="mt-3" block @click="hideModal">{{ $t('closeBtn')}}</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      errorMsgModal: '',
      modalErrorShow: false,
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit(evt) {
      this.modalErrorShow = false;
      evt.preventDefault();
      const mail = this.form.email;
      const psw = this.form.password;

      this.$store.state.http.post('api/auth', { email: mail, key: psw })
        .then((response) => {
          const t = response.data.token.toString();
          const u = response.data.user.toString();
          localStorage.ecoAssToken = t;
          localStorage.ecoAssUser = u;
          this.$store.commit('login', { token: t, user: u });
          this.$router.push('/meals');
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              this.errorMsgModal = this.$i18n.t('unauthorized');
              this.modalErrorShow = true;
            } else {
              this.errorMsgModal = this.$i18n.t('genericError');
              this.modalErrorShow = true;
            }
          } else {
            this.errorMsgModal = this.$i18n.t('noAnswer');
            this.modalErrorShow = true;
          }
        });
    },
    hideModal() {
      this.$bvModal.hide('modal-error');
    },
    changeType() {
      const t = document.getElementById('input-password').type;
      if (t === 'text') {
        document.getElementById('input-password').type = 'password';
        document.getElementById('buttonHideShow').style = 'background-position: 0px 0px';
      } else {
        document.getElementById('input-password').type = 'text';
        document.getElementById('buttonHideShow').style = 'background-position: -44px 0px';
      }
    },
  },
};
</script>

<i18n>
{
  "en": {
    "info": "We'll never share your email with third parties.",
    "info-psw": "Password must be 8 to 20 characters long. It cannot contain spaces.",
    "not-reg": "Not registered?",
    "reg": "Sign in",
    "unauthorized": "Wrong credentials!",
    "closeBtn": "Ok",
    "genericError": "Errors occurred. Try again later",
    "noAnswer": "No answer from server. Try again later"
  },
  "it": {
    "info": "Non condivideremo mai la tua email con terze parti.",
    "info-psw": "La password deve essere lunga tra 8 e 20 caratteri. Non può contenere spazi.",
    "not-reg":"Non sei ancora registrato?",
    "reg": "Registrati",
    "unauthorized": "Credenziali errate!",
    "closeBtn": "Ok",
    "genericError": "Qualcosa è andato storto. Riprova più tardi",
    "noAnswer": "Nessuna risposta dal server. Riprova più tardi"
  }
}
</i18n>
<style lang="sass">
  @import './login.sass'
</style>
