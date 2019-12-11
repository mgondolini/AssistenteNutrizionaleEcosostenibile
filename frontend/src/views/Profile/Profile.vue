<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <button v-on:click="editContent" class="card-button card-edit">
          <i v-show="!isEditing" class="material-icons" aria-hidden="true">create</i>
          <i v-show="isEditing" class="material-icons" aria-hidden="true"
          v-on:click="update">save</i>
          </button>
          <div class="card-title mb-4">
            <div class="d-flex justify-content-start">
              <div class="image-container">
                  <img v-bind:src= "avatar" id="imgProfile"
                  class="card-avatar card-avatar--circle" />
                  <div class="middle">
                    <input type="button" class="btn btn-secondary"
                    id="btnChangePicture" value="Change" v-on:click="activateBtn"/>
                    <input type="file" id="profilePicture" @change="uploadImgNew" name="file" />
                  </div>
              </div>
              <div class="userData ml-3">
                <h2 class="d-block"> {{ $t('profile') }} <br/><i>{{username}}</i></h2>
              </div>
              <div class="ml-auto">
                <input type="button" class="btn btn-primary d-none"
                id="btnDiscard" value="Discard Changes" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="basicInfo-tab"
                  data-toggle="tab" href="#basicInfo" role="tab"
                  aria-controls="basicInfo" aria-selected="true">
                  {{ $t('info') }}</a>
                </li>
              </ul>
              <div class="tab-content ml-1" id="myTabContent">
                <div class="tab-pane fade show active" id="basicInfo"
                  role="tabpanel" aria-labelledby="basicInfo-tab">
                  <!--NAME-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                        <label class="labelText">
                          {{ $t('name') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">
                        {{name}}
                    </div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                        <b-input size="sm" v-model="name"
                        type="text" class="card-input"
                        placeholder="Enter your name..."></b-input>
                    </div>

                  </div>
                  <hr />
                  <!--SURNAME-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                        <label class="labelText">
                          {{ $t('surname') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">
                        {{ surname}}
                    </div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                        <b-input size="sm" v-model="surname"
                        type="text" class="card-input"
                        placeholder="Enter your surname..."></b-input>
                    </div>
                  </div>
                  <hr />
                  <!--MAIL-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText">
                        {{ $t('email') }}
                      </label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">
                        {{email}}
                    </div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                      <b-input size="sm" v-model="email"
                      type="text" class="card-input"
                      placeholder="Enter your mail..."></b-input>
                    </div>
                  </div>
                  <hr />
                  <!--todo: DATA DA FAR VISUALIZZARE CON UN CALENDARIO-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText">
                        {{ $t('dateOfBirth') }}
                      </label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">
                        {{dateOfBirth}}
                    </div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                        DatePicker da inserire
                    </div>
                  </div>
                  <hr />
                  <!--GENDER-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText"> {{ $t('gender') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">{{sex.toUpperCase()}}</div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                      <b-select size="sm" v-model="genderSelected">
                        <option disabled value=""> {{ $t('gender') }}</option>
                        <option v-for="opt in gender" v-bind:key="opt" v-bind:value="opt">
                          {{ opt.toUpperCase() }}
                        </option>
                      </b-select>
                    </div>
                  </div>
                  <hr />
                  <!--WEIGHT-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText">{{ $t('weight') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">{{weight}} kg</div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                      <b-input size="sm" v-model="weight"
                      type="number" number
                      class="card-input"
                      placeholder="Enter your weight..."></b-input>
                    </div>
                  </div>
                  <hr />
                  <!--HEIGHT-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText">{{ $t('height') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">{{height}} cm</div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                      <b-input size="sm" v-model="height"
                      type="number" number
                      class="card-input"
                      placeholder="Enter your height..."></b-input>
                    </div>
                  </div>
                  <hr />
                  <!--ALLERGENS-->
                  <div class="row">
                    <div class="col-sm-3 col-md-2 col-5">
                      <label class="labelText">{{ $t('allergen') }}</label>
                    </div>
                    <div v-show="!isEditing" class="col-md-8 col-6">{{allergens}}</div>
                    <div v-show="isEditing" class="col-md-8 col-6">
                      <b-input size="sm" v-model="allergens"
                      type="text"
                      class="card-input"
                      placeholder="Enter your allergens..."></b-input>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      name: '',
      surname: '',
      dateOfBirth: '',
      email: '',
      avatar: '',
      sex: '',
      genderSelected: '',
      weight: '',
      height: '',
      allergens: '',
      isEditing: false,
      gender: ['m', 'f'],
    };
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
      if (!this.isEditing) {
        this.isEditing = !this.isEditing;
      } else {
        this.isEditing = !this.isEditing;
      }
    },
    update() {
      const dataNew = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        sex: this.genderSelected,
        avatar: this.avatar,
        weight: this.weight,
        height: this.height,
        allergens: this.allergens,
      };
      // Questo log è da togliere --> dataNew va passato
      // alla richiesta PUT per aggiornare le informazioni dell'utente
      console.log('hello from update method with DATA', dataNew);
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
      .then((response) => {
        this.username = response.data.username;
        this.name = response.data.name;
        this.surname = response.data.surname;
        this.dateOfBirth = response.data.birth_date;
        this.email = response.data.email;
        this.avatar = response.data.user_img_url;
        this.sex = response.data.sex;
        this.weight = response.data.weight;
        this.height = response.data.height;
        this.allergens = response.data.allergens;

        this.dateOfBirth = this.dateOfBirth.slice(0, 10);
        this.weight = this.weight.toString();
      })
      .catch(error => (console.log(error)));
  },
};
</script>

<i18n>
{
  "en": {
    "info": "Your info",
    "name": "Name",
    "surname": "Surname",
    "dateOfBirth": "Birth Date",
    "email": "Your email",
    "gender": "Gender",
    "weight": "Weight",
    "height": "Height",
    "allergen": "Allergens",
    "profile": "Profile of "

  },
  "it": {
    "info": "Le tue informazioni",
    "name": "Nome",
    "surname": "Cognome",
    "dateOfBirth": "Data di nascita",
    "email": "La tua email",
    "gender": "Genere",
    "weight": "Peso",
    "height": "Altezza",
    "allergen": "Allergeni",
    "profile": "Profilo di "
  }
}
</i18n>

<style>
  @import './Profile.scss';
</style>
