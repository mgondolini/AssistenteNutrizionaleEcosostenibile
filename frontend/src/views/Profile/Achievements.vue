<template>
  <div>
    <h3></h3>
    <div :id="tmp.key" class="border-color notReached" v-for="tmp in achievement"
       v-bind:key="tmp.key" >
      <div class="row">
        <div class="col-2">
          <img class="ach-img1" :src="tmp.img">
        </div>
        <div class="col-md-8 col-6">
          <p class="textTitle"> {{`${tmp.title}`}}</p>
        </div>
        <div class="col-md-2 col-2">
          <p class="textCounter"> {{`${tmp.counter}`}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en":{

    "first_reg": "Your first registration!",
    "first_meal": "Your first meal insertion!",
    "green_meal": "Green meal! Very well",
    "water_saver_meal": "Your meal is water saver!",
    "nutritional_need_meal": "The energy of your meal is not over your nutritional need",
    "perf_meal": "Your meal is perfect",
    "ten_green_meal": "10 Green meals! Very well",
    "ten_water_saver_meal": "10 meals water saver!",
    "ten_nutritional_need_meal": "10 of your meal are not over your nutritional need",
    "ten_perf_meal": "10 perfect meals!"
  },
  "it":{
    "first_reg": "La tua prima registrazione!",
    "first_meal": "Il tuo primo pasto insterito",
    "green_meal": "Pasto ecologico! Molto bene",
    "water_saver_meal": "Con il tuo pasto hai risparmiato acqua!",
    "nutritional_need_meal": "L'energia del tuo pasto non è al di sopra del tuo fabbisogno",
    "perf_meal": "Il tuo pasto è perfetto!",
    "ten_green_meal": "10 pasti ecologici! Wow, sei un grande!!",
    "ten_water_saver_meal": "10 pasti water-saver!",
    "ten_nutritional_need_meal": "10dei tuoi pasti non sono al di sopra del tuo fabbisogno",
    "ten_perf_meal": "10 pasti perfetti!"
  }
}
</i18n>

<script>
const aContext = require.context('@/assets/achievement/', false);

export default {
  name: 'Achievements',
  data() {
    return {
      achievement: [
        {
          key: 1,
          img: aContext('./firstReg.svg'),
          title: this.$i18n.t('first_reg'),
          counter: 0,
        },
        {
          key: 2,
          img: aContext('./firstMeal.svg'),
          title: this.$i18n.t('first_meal'),
          counter: 1,
        },
      ],
    };
  },
  mounted() {
    this.achievement.forEach((a) => {
      if (a.counter > 0) {
        document.getElementById(a.key).classList.remove('notReached');
        document.getElementById(a.key).classList.add('reached');
      } else {
        document.getElementById(a.key).classList.remove('reached');
        document.getElementById(a.key).classList.add('notReached');
      }
    });
  },
};
</script>

<style lang="sass">
@import './achievement.sass'
</style>
