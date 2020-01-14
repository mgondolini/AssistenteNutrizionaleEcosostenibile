import datePicker from 'vue-bootstrap-datetimepicker';

export default {
  name: 'registration',
  data() {
    return {
      datePlaceholder: new Date().toLocaleDateString(),
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
      if (p !== rp) {
        // repsw no match
        this.correctRePsw = false;
        document.getElementById('re-input-password').className = 'form-control regRePswError';
      }
    },
  },
};
