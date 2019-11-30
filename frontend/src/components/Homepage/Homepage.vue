<template>
  <div class="hello">
    <img class="loginImg" center src="../../assets/ecology.png" />
    <h1>{{ msg }}</h1>
    <p>
      Ma la volpe col suo balzo ha raggiunto il quieto Fido.
      Quel vituperabile xenofobo zelante assaggia il whisky ed esclama:
      alleluja! Aquel vituperable xenófobo apasionado prueba su güisqui y exclama:
      ¡Aleluya! Ma la volpe col suo balzo ha raggiunto il quieto Fido. Quel vituperabile
      xenofobo zelante assaggia il whisky ed esclama: alleluja! Aquel vituperable xenófobo
      apasionado prueba su güisqui y exclama: ¡Aleluya! Ma la volpe col suo balzo ha
      raggiunto il quieto Fido. Quel vituperabile xenofobo zelante assaggia il
      whisky ed esclama: alleluja! Aquel vituperable xenófobo apasionado prueba
      su güisqui y exclama: ¡Aleluya! Ma la volpe col suo balzo ha raggiunto il
      quieto Fido. Quel vituperabile xenofobo zelante assaggia il whisky ed esclama:
      alleluja! Aquel vituperable xenófobo apasionado prueba su güisqui y exclama:
      ¡Aleluya! Ma la volpe col suo balzo ha raggiunto il quieto Fido. Quel
      vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja!
      Aquel vituperable xenófobo apasionado prueba su güisqui y exclama:
      ¡Aleluya! Ma la volpe col suo balzo ha raggiunto il quieto Fido.
      Quel vituperabile xenofobo zelante assaggia il whisky ed esclama:
      alleluja! Aquel vituperable xenófobo apasionado prueba su güisqui
      y exclama: ¡Aleluya!Ma la volpe col suo balzo ha raggiunto il
      quieto Fido. Quel vituperabile xenofobo
    </p>

    <router-link to='login' class="wrapper-inner-tab-backgrounds-first"
      v-if='this.$isLogged === false'
      style="text-decoration:none">
      <div class="sim-button button1" >
        <span>Login</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  props: {
    msg: String,
  },
};
</script>

<style lang="scss">
  @import './homepage.scss';
</style>
