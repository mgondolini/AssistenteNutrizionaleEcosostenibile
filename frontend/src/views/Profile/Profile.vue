<template>
<div class="container profileIntro">
  <div class="row">
    <div class="col-12">
      <div class="card cardR">
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
              <b-tabs class="tab-content mt-3" id="myTabContent">
                <b-tab class="tab-content-info" :title="$t('info')" active>
                  <div v-for="tmp in campi"
                    v-bind:key="tmp.key" >
                    <div class="row">
                      <div class="col-sm-3 col-md-2 col-5">
                        <label class="labelText">{{ $t(`${tmp.key}`) }}</label>
                      </div>
                      <div v-show="!isEditing" class="col-md-8 col-6">
                        <span v-if="tmp.key == 'gender'"> {{`${tmp.value.toUpperCase()}`}}</span>
                        <div class="col-md-4 col-4 listAll" v-else-if="tmp.key == 'allergen'">
                          <ul v-for="a in tmp.value" v-bind:key="a">
                            <li class="elemList">{{$t(`${a}`)}}</li>
                          </ul>
                        </div>
                        <span v-else> {{`${tmp.value}`}}</span>
                      </div>

                      <div v-show="isEditing" class="col-md-8 col-6">
                        <div v-if="tmp.key == 'weight' || tmp.key == 'height'">
                          <b-input size="sm" v-model="tmp.value"
                            type="number"
                            class="card-input-hw"
                            :id="tmp.key"
                            :placeholder= "tmp.placeholder" ></b-input>
                        </div>
                        <div v-else-if="tmp.key == 'dateOfBirth'">
                          <date-picker class="card-input-date"
                            name="date" v-model="tmp.value"
                            :config="options"
                            :id="tmp.key"
                            value="dateOfBirth"></date-picker>
                        </div>


                        <div class="allergensDiv" v-else-if="tmp.key == 'allergen'">
                          <multiselect v-model="selectedAllergens"
                            :placeholder="$t('allergensPlaceholder')"
                            :select-label="$t('selectLabel')"
                            :custom-label="allT" open-direction="top" :hide-selected="true"
                            track-by="code" :options="optionsMS" :multiple="true"
                            :taggable="false" :max-height="200"></multiselect>
                        </div>


                        <div v-else-if="tmp.key == 'gender'">
                          <!--check che sia selezionato-->
                          <b-select class="card-input-g" :id="tmp.key"
                            size="sm" v-model="tmp.value">
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
                            class="card-input-ns"
                            :id="tmp.key"
                            :placeholder= "tmp.placeholder" ></b-input>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                </b-tab>
                <b-tab class="tab-content-info" :title="$t('achievements')">
                    <div>
                      <div :id="tmp.title" :class="tmp.style"
                        v-for="tmp in achievements"
                        v-bind:key="tmp.title" >
                        <div class="row">
                          <div class="col-2">
                            <img class="ach-img1" :src="tmp.img">
                          </div>
                          <div class="col-md-8 col-6">
                            <p class="textTitle"> {{`${tmp.title}`}}</p>
                          </div>
                          <div class="col-md-2 col-2">
                            <p class="textCounter"> {{`${tmp.count}`}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <b-modal id="modal-error" title="Error" hide-footer>
    <div class="d-block text-center">
      <img src="../../assets/restrictionShield.png">
      {{ this.errorMsgModal }}
    </div>
    <b-button class="mt-3" block @click="hideModal">{{ $t('closeBtn')}}</b-button>
  </b-modal>
</div>
</template>

<script src="./Profile.js">
</script>

<i18n src="./languageText.json"></i18n>
<i18n src="../../locales/errorMessages.json"></i18n>

<style lang="sass">
@import './Profile.sass'
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
