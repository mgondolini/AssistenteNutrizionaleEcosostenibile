<template>
  <div class="hello">
    <h1 class="msgTitle">{{ $t('title') }}</h1>
    <SliderImage/>
    <br/>
    <div class="our_mission">
      <div class="mis">
        <h1 class="mission homeMission"> {{ $t('mission') }} </h1>
        <img src="../../assets/Immagine.png" alt="separator">
      </div>
      <br/>
      <h5 class="missionText">
        <span class="homeMission"> {{ $t('text1') }}  <strong> {{ $t('text2') }} </strong>
         {{ $t('text3') }}
      </span></h5>
      <h5 class="missionText" style="text-align: center;">
        <span class="homeMission"> {{ $t('text4') }} </span>
      </h5>
      <div class="row middleBan">
        <div class="wpb_column vc_column_container vc_col-sm-4 vc_hidden-sm vc_hidden-xs">
          <div class="vc_column-inner">
            <div class="wpb_wrapper">
              <div class="wpb_single_image wpb_content_element
              vc_align_center vc_custom_1548164725205">
                <div class="wpb_wrapper">
                  <div class="vc_single_image-wrapper   vc_box_border_grey">
                    <img class="vc_single_image-img " src="../../assets/home/Group.svg"
                    width="" height="" alt="Group" title="Group" />
                    </div>
                  </div>
                </div>
              <div class="wpb_text_column wpb_content_element  ombraBox vc_custom_1548165107261">
                <div class="wpb_wrapper">
                  <div style="text-align: center;">
                    <h1 class="titleBanner">{{ $t('educate') }} </h1>
                  </div>
                  <p class="textBlock" style="text-align: center;">
                    {{ $t('educapop') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wpb_column vc_column_container vc_col-sm-4 vc_hidden-sm vc_hidden-xs">
          <div class="vc_column-inner">
            <div class="wpb_wrapper">
              <div class="wpb_single_image wpb_content_element
              vc_align_center vc_custom_1548164725205">
                <div class="wpb_wrapper">
                  <div class="vc_single_image-wrapper   vc_box_border_grey">
                    <img class="vc_single_image-img " src="../../assets/home/SecondIcon.svg"
                    width="" height="" alt="Group" title="Group" />
                    </div>
                  </div>
                </div>
              <div class="wpb_text_column wpb_content_element  ombraBox vc_custom_1548165107261">
                <div class="wpb_wrapper">
                  <div style="text-align: center;">
                    <h1 class="titleBanner">{{ $t('save') }}</h1>
                  </div>
                  <p class="textBlock" style="text-align: center;">
                    {{ $t('saveplanet') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wpb_column vc_column_container vc_col-sm-4 vc_hidden-sm vc_hidden-xs">
          <div class="vc_column-inner">
            <div class="wpb_wrapper">
              <div class="wpb_single_image wpb_content_element
              vc_align_center vc_custom_1548164725205">
                <div class="wpb_wrapper">
                  <div class="vc_single_image-wrapper   vc_box_border_grey">
                    <img class="vc_single_image-img resp" src="../../assets/home/dona-1.svg"
                    width="" height="" alt="Group" title="Group" />
                    </div>
                  </div>
                </div>
              <div class="wpb_text_column wpb_content_element  ombraBox vc_custom_1548165107261">
                <div class="wpb_wrapper">
                  <div style="text-align: center;">
                    <h1 class="titleBanner">{{ $t('respect') }}</h1>
                  </div>
                  <p class="textBlock" style="text-align: center;">
                   {{ $t('respEarth') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="buttonsDiv">
      <router-link to='login' class="wrapper-inner-tab-backgrounds-first"
        v-if='this.$store.state.isLogged === false'
        style="text-decoration:none">
        <b-button class="sim-button button1">Login</b-button>
      </router-link>
      <router-link to='registration' class="wrapper-inner-tab-backgrounds-first"
        v-if='this.$store.state.isLogged === false'
        style="text-decoration:none; margin-bottom:30px;">
        <b-button class="sim-button button1 reg" >{{ $t('reg') }} </b-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import SliderImage from './SliderImage.vue';

export default {
  name: 'Homepage',
  components: {
    SliderImage,
  },
};
</script>

<i18n src="./homeText.json"></i18n>

<style lang="sass">
  @import './homepage.sass'
</style>
