<template>
  <div class="registration">
    <b-form @submit="onSubmit" class="formInsR">
      <div class="container registrationContainer">
        <div class="row">
          <div class="col-12">
            <div class="card cardR">
              <div class="card-body">
                <div class="card-title mb-4">
                  <h3 class="titleReg">{{ $t('reg') }}</h3>
                </div>

                <div class="row">
                  <div class="col-12">
                    <hr/>
                    <div class="tab-content ml-1" id="myTabContent">
                      <div class="tab-pane fade show active" id="basicInfo"
                        role="tabpanel" aria-labelledby="basicInfo-tab">
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('user-name') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="input-username"
                                v-model="form.username"
                                required
                                type="text"
                                @focusout="onBlurUser"
                                :placeholder="$t('enterU')"
                                aria-describedby="user-help-block"
                              ></b-form-input>
                              <b-form-text id="user-help-block" v-show="!correctUser">
                                {{ $t('username') }}
                              </b-form-text>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('mail1') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="input-email"
                                v-model="form.email"
                                type="email"
                                required
                                @focusout="onBlurEmail"
                                :placeholder="$t('enterE')"
                                aria-describedby="email-help-block"
                              ></b-form-input>
                              <b-form-text id="email-help-block" v-show="!correctEmail">
                                {{ $t('mail') }}
                              </b-form-text>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('pwd1') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="input-password"
                                v-model="form.password"
                                type="password"
                                required
                                @focusout="onBlurPsw"
                                :placeholder="$t('enterP')"
                                aria-describedby="password-help-block"
                              ></b-form-input>
                              <button id="buttonHideShowPsw" title="Hold down to show password"
                                @click="changeTypePsw" type = "button"></button>
                              <b-form-text id="password-help-block">
                                  {{ $t('pwd') }}
                              </b-form-text>
                            </div>
                          </div>
                          <div class="row pers">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('reinsert') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="re-input-password"
                                v-model="form.repassword"
                                type="password"
                                required
                                @focusout="onBlurRePsw"
                                :placeholder="$t('enterRP')"
                                aria-describedby="password-help-block"
                              ></b-form-input>
                              <button id="buttonHideShowRePsw" title="Hold down to show password"
                              @click="changeTypeRePsw" type = "button"></button>
                            </div>
                          </div>
                          <h4 class="pers">{{ $t('pers') }}</h4>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('name') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                  id="input-name"
                                  v-model="form.name"
                                  required
                                  :placeholder="$t('enterN')"
                                ></b-form-input>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('surname') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                  id="input-surname"
                                  v-model="form.surname"
                                  required
                                  :placeholder="$t('enterS')"
                                ></b-form-input>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('height') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="input-height"
                                type="number"
                                v-model="form.height"
                                required
                                :placeholder="$t('enterH')"
                              ></b-form-input>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('weight') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-input
                                id="input-weight"
                                type="number"
                                v-model="form.weight"
                                required
                                :placeholder="$t('enterW')"
                              ></b-form-input>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('allergens') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <multiselect v-model="selectedAllergens"
                                :placeholder="$t('allergensPlaceholder')"
                                :select-label="$t('selectLabel')"
                                :custom-label="allT" open-direction="bottom" :hide-selected="true"
                                track-by="code" :options="optionsMS" :multiple="true"
                                :taggable="false" :max-height="200"></multiselect>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('sex') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <b-form-select id="input-sex" required v-model="form.sex.value">
                                <option disabled value=""> {{ $t(`${form.sex.key}`) }}</option>
                                <option v-for="opt in form.sex.ar"
                                  :key="opt" :value="opt">
                                  {{ opt.toUpperCase() }}
                                </option>
                              </b-form-select>
                            </div>
                          </div>
                          <hr/>
                          <div class="row">
                            <div class="col-sm-2 col-md-2 col-4">
                              <label class="labelText">{{ $t('DOB') }}</label>
                            </div>
                            <div class="col-md-8 col-8">
                              <date-picker name="date"
                                required v-model="form.dateOfBirth"
                                :config="options"
                                :placeholder="datePlaceholder"></date-picker>
                            </div>
                          </div>
                          <hr/>
                          <div class="text-center buttonsDiv">
                            <b-button class="sim-button button1" type="submit">
                              {{ $t('reg-me') }}</b-button>
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
    </b-form>
    <b-modal id="modal-ach" :title="$i18n.t('achModalTitle')" hide-footer>
      <div class="d-block text-center">
        {{ $t('achMsgModal') }}
      </div>
      <b-button class="mt-3" block @click="hideModalAch">{{ $t('achBtnModal')}}</b-button>
    </b-modal>
  </div>
</template>

<script src="./Registration.js">
</script>

<i18n  src="./languageText.json"></i18n>
<i18n  src="../Profile/languageText.json"></i18n>

<style lang="sass">
  @import './registration'
</style>
