<template>
  <div class="container">
    <h1>{{ msg }}</h1>
    <h3>Composizione del tuo pasto</h3>

    <router-link to='login' class="wrapper-inner-tab-backgrounds-first"
      v-if='this.$isLogged === false'
      style="text-decoration:none">
      <div class="sim-button button1" >
        <span>Login</span>
      </div>
    </router-link>
  </div>
</template>
