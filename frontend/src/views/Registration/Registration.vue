<template>
<b-form @submit="onSubmit" class="formIns">
  <div class="container registrationContainer">
    <div class="row">
      <div class="col-12">
        <div class="card">
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
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('user-name') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="input-username"
                            v-model="form.username"
                            required
                            @focusout="onBlurUser"
                            placeholder="Inserisci username"
                            aria-describedby="user-help-block"
                          ></b-form-input>
                          <b-form-text id="user-help-block">
                            {{ $t('username') }}
                          </b-form-text>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('mail1') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="input-email"
                            v-model="form.email"
                            type="email"
                            required
                            @focusout="onBlurEmail"
                            placeholder="Inserisci email"
                            aria-describedby="email-help-block"
                          ></b-form-input>
                          <b-form-text id="email-help-block">
                            {{ $t('mail') }}
                          </b-form-text>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('pwd1') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="input-password"
                            v-model="form.password"
                            type="password"
                            required
                            @focusout="onBlurPsw"
                            placeholder="Inserisci password"
                            aria-describedby="password-help-block"
                          ></b-form-input>
                          <b-form-text id="password-help-block">
                              {{ $t('pwd') }}
                          </b-form-text>
                        </div>
                      </div>
                      <div class="row pers">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('reinsert') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="re-input-password"
                            v-model="form.repassword"
                            type="password"
                            required
                            @focusout="onBlurRePsw"
                            placeholder="Inserisci password"
                            aria-describedby="password-help-block"
                          ></b-form-input>
                        </div>
                      </div>
                      <h4 class="pers">{{ $t('pers') }}</h4>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('name') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                              id="input-name"
                              v-model="form.name"
                              required
                              placeholder="Inserisci nome"
                            ></b-form-input>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('surname') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                              id="input-surname"
                              v-model="form.surname"
                              required
                              placeholder="Inserisci cognome"
                            ></b-form-input>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('height') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="input-height"
                            type="number"
                            v-model="form.height"
                            required
                            placeholder="Inserisci altezza"
                          ></b-form-input>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('weight') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                            id="input-weight"
                            type="number"
                            v-model="form.weight"
                            required
                            placeholder="Inserisci peso"
                          ></b-form-input>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('allergens') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-input
                              id="input-allergens"
                              v-model="form.allergens"
                              placeholder="Inserisci allergeni"
                              aria-describedby="allergens-help-block"
                            ></b-form-input>
                            <b-form-text id="allergens-help-block">
                              {{ $t("allergens-info")}}
                            </b-form-text>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('sex') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
                          <b-form-select id="input-sex" required v-model="form.sex.value">
                            <option disabled value=""> {{ form.sex.key }}</option>
                            <option v-for="opt in form.sex.ar"
                              :key="opt" :value="opt">
                              {{ opt.toUpperCase() }}
                            </option>
                          </b-form-select>
                        </div>
                      </div>
                      <hr/>
                      <div class="row">
                        <div class="col-sm-3 col-md-3 col-5">
                          <label class="labelText">{{ $t('DOB') }}</label>
                        </div>
                        <div class="col-md-8 col-6">
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
</template>

<script src="./Registration.js">

</script>

<i18n  src="./languageText.json">
</i18n>

<style lang="sass">
  @import './registration'
</style>
