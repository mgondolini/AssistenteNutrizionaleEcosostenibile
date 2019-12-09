<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="card-title mb-4">
            <div class="d-flex justify-content-start">
              <div class="image-container">
                  <img v-bind:src= "avatar"
                  id="imgProfile" style="width: 150px; height: 150px"
                  class="img-thumbnail" />
                  <div class="middle">
                      <input type="button" class="btn btn-secondary"
                      id="btnChangePicture" value="Change" />
                      <input type="file" style="display: none;"
                      id="profilePicture" name="file" />
                  </div>
              </div>
              <div class="userData ml-3">
                <h2 class="d-block"
                style="
                font-size: 1.5rem; font-weight: bold;">
                Profilo di <br/><i>{{username}}</i></h2>
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
                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                            <label style="font-weight:bold;">
                              {{ $t('full_name') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                            {{name}} {{ surname}}
                        </div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                          <label style="font-weight:bold;">
                            {{ $t('email') }}
                          </label>
                        </div>
                        <div class="col-md-8 col-6">
                            {{email}}
                        </div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                          <label style="font-weight:bold;">
                            {{ $t('dateOfBirth') }}
                          </label>
                        </div>
                        <div class="col-md-8 col-6">
                            {{dateOfBirth}}
                        </div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                          <label style="font-weight:bold;">
                            {{ $t('gender') }}</label>
                        </div>
                        <div class="col-md-8 col-6">{{sex.toUpperCase()}}
                        </div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                          <label style="font-weight:bold;">{{ $t('weight') }}</label>
                        </div>
                        <div class="col-md-8 col-6">{{weight}} kg</div>
                      </div>
                      <hr />

                      <div class="row">
                        <div class="col-sm-3 col-md-2 col-5">
                          <label style="font-weight:bold;">{{ $t('height') }}</label>
                        </div>
                        <div class="col-md-8 col-6">{{height}} cm</div>
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
      dateOfBirth: Date,
      email: '',
      avatar: '',
      sex: '',
      weight: Number,
      height: Number,
      allergens: '',
      isShelfOpen: false,
      isEditing: false,
      gender: ['male', 'female'],
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
        this.isShelfOpen = true;
      } else {
        this.isEditing = !this.isEditing;
        this.isShelfOpen = false;
      }
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
      })
      .catch(error => (console.log(error)));
  },
};
</script>

<i18n>
{
  "en": {
    "info": "Your info",
    "full_name": "Full Name",
    "dateOfBirth": "Birth Date",
    "email": "Your email",
    "gender": "Gender",
    "weight": "Weight",
    "height": "Height"

  },
  "it": {
    "info": "Le tue informazioni",
    "full_name": "Nome e cognome",
    "dateOfBirth": "Data di nascita",
    "email": "La tua email",
    "gender": "Genere",
    "weight": "Peso",
    "height": "Altezza"
  }
}
</i18n>

<style>
  @import './Profile.scss';
</style>
