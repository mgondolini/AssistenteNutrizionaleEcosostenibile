import Multiselect from 'vue-multiselect';
import allergensList from '../../allergens.json';

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
        dateOfBirth: new Date(),
        sex: {
          key: 'gender',
          value: '',
          ar: ['m', 'f'],
        },
        img: '',

      },
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: false,
        showClear: false,
        showClose: true,
      },
      optionSex: [
        { name: 'Gender', label: 'sex', $isDisabled: true },
        { name: 'f', label: 'female' },
        { name: 'm', label: 'male' },
      ],
      attributes: [
        {
          key: 'today',
          dot: {
            color: 'red',
            contentClass: 'italic',
          },
        },
      ],
      selectedAllergens: [],
      optionsMS: [],
      correctUser: true,
      correctEmail: true,
      correctPsw: false,
      correctRePsw: false,
    };
  },
  components: {
    Multiselect,
  },
  mounted() {
    let i = 0;
    allergensList.name.forEach((elem) => {
      this.optionsMS.push({ name: elem, code: i });
      i += 1;
    });
  },
  methods: {
    allT(all) {
      return this.$i18n.t(all.name);
    },
    sexLabel(sex) {
      return this.$i18n.t(sex.label);
    },
    onSubmit(evt) {
      if (this.form.email.trim().length === 0) this.correctEmail = false;
      if (this.form.username.trim().length === 0) this.correctUser = false;
      evt.preventDefault();
      if (this.correctEmail && this.correctUser && this.correctPsw && this.correctRePsw) {
        const tmp = [];
        this.selectedAllergens.forEach((e) => {
          tmp.push(e.name);
        });
        const b = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
          surname: this.form.surname,
          birth_date: this.form.dateOfBirth,
          sex: this.form.sex.value.name,
          weight: this.form.weight,
          height: this.form.height,
          allergens: tmp,
        };
        this.$store.state.http.post('api/user', b).then(() => {
          this.$store.state.http.post('api/auth', { email: this.form.email, key: this.form.password })
            .then((response) => {
              const t = response.data.token.toString();
              const u = response.data.user;
              this.$store.commit('login', { token: t, user: u });
              this.$bvModal.show('modal-ach');
            }).catch((error) => {
              if (error.response) {
                this.$root.$emit('openModalError', 'internal_server_errorTitle', 'internal_server_error');
              } else {
                this.$root.$emit('openModalError', 'noAnswerTitle', 'noAnswer');
              }
            });
        }).catch((err) => {
          if (err.response) {
            this.$root.$emit('openModalError', 'internal_server_errorTitle', 'internal_server_error');
          } else {
            this.$root.$emit('openModalError', 'noAnswerTitle', 'noAnswer');
          }
        });
      } else {
        this.$root.$emit('openModalError', 'dataErrorTitle', 'dataError');
      }
    },
    onBlurUser() {
      // check if User already exist
      const u = this.form.username.trim();
      if (u.length > 0) {
        this.$store.state.http.get(`api/checkUser/${u}`).then((response) => {
          if (!response.data.match('ok')) {
            this.correctUser = false;
            // invalid user
            document.getElementById('input-username').className = 'form-control regUserError';
          } else {
            this.correctUser = true;
            document.getElementById('input-username').className = 'form-control';
          }
        }).catch(
          // something wrong, ignored
          // console.log(error);
        );
      } else {
        this.correctUser = true;
        document.getElementById('input-username').className = 'form-control';
      }
    },
    onBlurEmail() {
      // check if Email already exist
      const e = this.form.email.trim();
      if (e.length > 0) {
        this.$store.state.http.get(`api/checkEmail/${e}`).then((resp) => {
          if (!resp.data.match('ok')) {
            // invalid email
            this.correctEmail = false;
            document.getElementById('input-email').className = 'form-control regEmailError';
            // console.log('Wrong email');
          } else {
            this.correctEmail = true;
            document.getElementById('input-email').className = 'form-control';
          }
        }).catch(
          // something wrong, ignored
          // console.log(error);
        );
      } else {
        this.correctEmail = true;
        document.getElementById('input-email').className = 'form-control';
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
      if (p !== rp) {
        // repsw no match
        this.correctRePsw = false;
        document.getElementById('re-input-password').className = 'form-control regRePswError';
      }
    },
    changeTypePsw() {
      const t = document.getElementById('input-password').type;
      if (t === 'text') {
        document.getElementById('input-password').type = 'password';
        document.getElementById('buttonHideShowPsw').style = 'background-position: 0px 0px';
      } else {
        document.getElementById('input-password').type = 'text';
        document.getElementById('buttonHideShowPsw').style = 'background-position: -44px 0px';
      }
    },
    changeTypeRePsw() {
      const t = document.getElementById('re-input-password').type;
      if (t === 'text') {
        document.getElementById('re-input-password').type = 'password';
        document.getElementById('buttonHideShowRePsw').style = 'background-position: 0px 0px';
      } else {
        document.getElementById('re-input-password').type = 'text';
        document.getElementById('buttonHideShowRePsw').style = 'background-position: -44px 0px';
      }
    },
    hideModalAch() {
      this.$bvModal.hide('modal-ach');
      this.$router.push('/meals');
    },
  },
};
