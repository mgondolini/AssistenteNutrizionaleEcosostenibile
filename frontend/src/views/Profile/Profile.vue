<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <!--save/create BUTTONS-->
          <button v-on:click="editContent" class="card-button card-edit">
            <i v-show="!isEditing" class="material-icons" aria-hidden="true">create</i>
            <i v-show="isEditing" class="material-icons" aria-hidden="true"
            v-on:click="update">save</i>
          </button>
          <!--IMAGE PROFILE-->
          <div class="card-title mb-4">
            <div class="d-flex justify-content-start">
              <div class="image-container">
                  <img v-bind:src= "avatar" id="imgProfile"
                  class="card-avatar card-avatar--circle" />
                  <div class="middle">
                    <input v-show="isEditing" type="button" class="btn btn-secondary"
                    id="btnChangePicture" value="Change" v-on:click="activateBtn"/>
                    <input type="file" id="profilePicture" @change="uploadImgNew" name="file" />
                  </div>
              </div>
              <div class="userData ml-3">
                <h2 class="d-block"> {{ $t('profile') }} <br/><i>{{username}}</i></h2>
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

                  <div v-for="tmp in campi"
                    v-bind:key="tmp.key" >
                    <div class="row">
                      <div class="col-sm-3 col-md-2 col-5">
                        <label class="labelText">{{ $t(`${tmp.key}`) }}</label>
                      </div>
                      <div v-show="!isEditing" class="col-md-8 col-6">
                        <span v-if="tmp.key == 'gender'"> {{`${tmp.value.toUpperCase()}`}}</span>
                        <span v-else> {{`${tmp.value}`}}</span>
                      </div>

                      <div v-show="isEditing" class="col-md-8 col-6">
                        <div v-if="tmp.key == 'weight' || tmp.key == 'height'">
                          <b-input size="sm" v-model="tmp.value"
                            type="number"
                            class="card-input"
                            :placeholder= "tmp.placeholder" ></b-input>
                        </div>
                        <div v-else-if="tmp.key == 'dateOfBirth'">
                          <date-picker name="date" v-model="tmp.value"
                            :config="options"
                            value="dateOfBirth"></date-picker>
                        </div>
                        <div v-else-if="tmp.key == 'gender'">
                          <!--check che sia selezionato-->
                          <b-select size="sm" v-model="tmp.value">
                            <option disabled value=""> {{ $t(`${tmp.key}`) }}</option>
                            <option v-for="opt in tmp.ar"
                            v-bind:key="opt" v-bind:value="opt">
                              {{ opt.toUpperCase() }}
                            </option>
                          </b-select>
                        </div>
                        <div v-else-if="tmp.key == 'email'">
                          <span> {{`${tmp.value}`}}</span>
                        </div>
                        <div v-else>
                          <b-input size="sm" v-model="tmp.value"
                            type="text"
                            class="card-input"
                            :placeholder= "tmp.placeholder" ></b-input>
                        </div>
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
</div>
</template>

<script src="./Profile.js">
</script>

<i18n src="./languageText.json"></i18n>

<style lang="sass">
@import './Profile.sass'
</style>
