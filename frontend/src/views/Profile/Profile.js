import datePicker from 'vue-bootstrap-datetimepicker';
import Multiselect from 'vue-multiselect';
import Achievements from './Achievements.vue';
import allergensList from '../../allergens.json';

const aContext = require.context('@/assets/achievement/', false);
export default {
  data() {
    return {
      username: '',
      avatar: '',
      genderSelected: '',
      selectedAllergens: [],
      isEditing: false,
      errorMsgModal: '',

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
          value: [],
        },
      },
      achievements: [],
      errors: false,
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: false,
        showClear: false,
        showClose: false,
      },
      optionsMS: [],
    };
  },
  components: {
    datePicker,
    Achievements,
    Multiselect,
  },
  computed: {
    cardStates() {
      return {
        'card--is-edit': this.isEditing,
      };
    },
  },
  methods: {
    allT(all) {
      return this.$i18n.t(all.name);
    },
    checkError(error, status) {
      if (error === 'internal_server_error' || error === 'user_not_found') {
        this.errorMsgModal = error;
        this.$bvModal.show('modal-error');
      } else if (status === 401) {
        this.errorMsgModal = this.$i18n.t('unauthorized');
        this.$bvModal.show('modal-error');
      } else {
        this.errorMsgModal = this.$i18n.t('internal_server_error');
      }
    },
    editContent() {
      if (!this.errors) {
        this.isEditing = !this.isEditing;
      }
    },
    hideModal() {
      this.$bvModal.hide('modal-error');
      this.$router.push('/login');
    },
    update() {
      this.errors = false;
      this.$bvModal.hide('modal-error');
      if (!this.campi.name.value) {
        document.getElementById('name').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('name').classList.remove('nsError');
      }

      if (!this.campi.surname.value) {
        document.getElementById('surname').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('surname').classList.remove('nsError');
      }

      if (!this.campi.gender.value) {
        document.getElementById('gender').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('gender').classList.remove('nsError');
      }

      if (!this.campi.dateOfBirth.value) {
        document.getElementById('dateOfBirth').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('dateOfBirth').classList.remove('nsError');
      }

      if (!this.campi.weight.value) {
        document.getElementById('weight').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('weight').classList.remove('nsError');
      }

      if (!this.campi.height.value) {
        document.getElementById('height').classList.add('nsError');
        this.errors = true;
      } else {
        document.getElementById('height').classList.remove('nsError');
      }

      const tmp = [];
      this.campi.allergens.value = [];
      this.selectedAllergens.forEach((el) => {
        tmp.push(el.name);
        this.campi.allergens.value.push(el.name);
      });
      if (!this.errors) {
        const dataNew = {
          name: this.campi.name.value,
          surname: this.campi.surname.value,
          sex: this.campi.gender.value,
          user_img_url: this.avatar,
          weight: this.campi.weight.value,
          height: this.campi.height.value,
          allergens: tmp,
          birth_date: this.campi.dateOfBirth.value,
        };

        this.$store.state.http.put('api/user', dataNew)
          .then().catch(error => this.checkError(error.response.data.description,
            error.response.status));
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
    this.modalShow = false;
    this.$bvModal.hide('modal-error');

    this.$store.state.http.get('api/user')
      .then((response) => {
        if (response.data.username != null) this.username = response.data.username;

        if (response.data.name != null) this.campi.name.value = response.data.name;

        if (response.data.surname != null) this.campi.surname.value = response.data.surname;

        if (response.data.birth_date != null) {
          this.campi.dateOfBirth.value = response.data.birth_date;
        }

        if (response.data.email != null) this.campi.email.value = response.data.email;

        if (response.data.user_img_url != null) this.avatar = response.data.user_img_url;

        if (response.data.sex != null) this.campi.gender.value = response.data.sex;

        if (response.data.weight != null) this.campi.weight.value = response.data.weight;

        if (response.data.height) this.campi.height.value = response.data.height;

        if (response.data.allergens != null) {
          const tmp = response.data.allergens;
          let k = 0;
          tmp.forEach((element) => {
            this.selectedAllergens.push({ name: element, code: k });
            this.campi.allergens.value.push(element);
            k += 1;
          });
          let i = 0;
          allergensList.name.forEach((elem) => {
            this.optionsMS.push({ name: elem, code: i });
            i += 1;
          });
        }
        const ach = response.data.achievements;
        // ach
        ach.forEach((a) => {
          this.achievements.push({
            title: this.$i18n.t(a.title),
            count: a.count,
            img: aContext(`./${a.title}.svg`),
            style: a.count > 0 ? 'border-color reached' : 'border-color notReached',
          });
        });
      })
      .catch(error => this.checkError(error,
        error.response.status));
  },
};
