import datePicker from 'vue-bootstrap-datetimepicker';

export default {
  data() {
    return {
      username: '',
      avatar: '',
      genderSelected: '',
      isEditing: false,

      campi: {
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
        dateOfBirth: {
          key: 'dateOfBirth',
          value: '',
        },
        email: {
          key: 'email',
          value: '',
          placeholder: 'Enter your email',
        },
        gender: {
          key: 'gender',
          value: '',
          ar: ['m', 'f'],
        },
        weight: {
          key: 'weight',
          value: '',
          placeholder: 'Enter your weight',
        },
        height: {
          key: 'height',
          value: '',
          placeholder: 'Enter your height',
        },
        allergens: {
          key: 'allergen',
          value: '',
          placeholder: 'Enter your allergens',
        },
      },
      errors: [],
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
  computed: {
    cardStates() {
      return {
        'card--is-edit': this.isEditing,
      };
    },
  },
  methods: {
    editContent() {
      this.isEditing = !this.isEditing;
    },
    update() {
      this.errors = [];

      const usr = 'mrossi';
      const param = { username: usr };

      const dataNew = {
        username: this.username,
        name: this.campi.name.value,
        surname: this.campi.surname.value,
        email: this.campi.email.value,
        sex: this.campi.gender.value,
        user_img_url: this.avatar,
        weight: this.campi.weight.value,
        height: this.campi.height.value,
        allergens: this.campi.allergens.value,
        birth_date: this.campi.dateOfBirth.value,
      };

      if (!dataNew.name || !dataNew.surname
        || !dataNew.email || !dataNew.sex
        || !dataNew.weight || !dataNew.height
        || !dataNew.allergens) {
        this.errors.push('Field must not be null');
      } else {
        /* this.$http.put(global.config.server.concat(`api/user/${param.username}`),
          { params: param, data: dataNew }); */

        this.$http.put(global.config.server.concat(`api/user/${param.username}`), { params: param, data: dataNew });
      }
    },
    activateBtn() {
      document.getElementById('profilePicture').click();
    },
    uploadImgNew(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (ex) => {
        this.avatar = ex.target.result;
      };
    },
  },
  mounted() {
    const usr = 'mrossi';
    const param = { username: usr };

    this.$http.get(global.config.server.concat(`api/user/${param.username}`), { params: param })
    // this.$server.get(`api/user/${param.username}`, { params: param })
      .then((response) => {
        this.username = response.data.username;
        this.campi.name.value = response.data.name;
        this.campi.surname.value = response.data.surname;
        this.campi.dateOfBirth.value = response.data.birth_date;
        this.campi.email.value = response.data.email;
        this.avatar = response.data.user_img_url;
        this.campi.gender.value = response.data.sex;
        this.campi.weight.value = response.data.weight;
        this.campi.height.value = response.data.height;
        this.campi.allergens.value = response.data.allergens;

        this.campi.dateOfBirth.value = this.campi.dateOfBirth.dateParse('YYYY-MM-DD').dateFormat('MMMM D, YYYY');
      })
      .catch(error => (error.toString()));
  },
};
