<template>
    <div class="nav-bar">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <router-link class="navbar-brand" to="/">Eco-assistant</router-link>
            <b-nav-toggle target="nav_collapse"></b-nav-toggle>
            <b-collapse is-nav id="nav_collapse">

                <b-nav is-nav-bar>
                    <router-link to="home">Informazioni prodotto</router-link>
                    <router-link to="about" v-if="isLogged === true"> About</router-link>
                </b-nav>

                <b-nav is-nav-bar class="ml-auto">

                <b-nav-item to="login" v-if="isLogged === false">Login</b-nav-item>

                <b-nav-item-dropdown right-alignment v-if="isLogged === true">

                    <template slot="text">
                    <span style="font-weight: bold;">User</span>
                    </template>

                    <b-dropdown-item href="#">Il mio profilo</b-dropdown-item>
                    <b-dropdown-item href="#">Imiei pasti</b-dropdown-item>
                    <b-dropdown-item href="#">Inserisci nuovo pasto</b-dropdown-item>
                    <b-dropdown-item @click.prevent="singout">Esci</b-dropdown-item>
                </b-nav-item-dropdown>

                </b-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
  name: 'navbar',

  data() {
    return {
      navhome: 'Eco-assistant',
      isLogged: true,
    };
  },
};
</script>


<style>
  @import './navbar.scss';
</style>

  <!--
  <template>
    <div class="nav-bar">
      <b-navbar toggleable="lg" type="dark" variant="info">
      <b-link class="navbar-brand" to="home">Eco-assistant</b-link>
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-collapse is-nav id="nav_collapse">

        <b-nav is-nav-bar>
          <b-nav-item to="home">Informazioni prodotto</b-nav-item>
          <b-nav-item to="about" v-if="isLogged === true">About</b-nav-item>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto">

          <b-nav-item to="login" v-if="isLogged === false">Login</b-nav-item>

          <b-nav-item-dropdown right-alignment v-if="isLogged === true">

            <template slot="text">
              <span style="font-weight: bold;">User</span>
            </template>

            <b-dropdown-item href="#">Il mio profilo</b-dropdown-item>
            <b-dropdown-item href="#">Imiei pasti</b-dropdown-item>
            <b-dropdown-item href="#">Inserisci nuovo pasto</b-dropdown-item>
            <b-dropdown-item @click.prevent="singout">Esci</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-nav>
      </b-collapse>
    </b-navbar>
</div>
</template>

<script>
export default {
  name: 'navbar',

  data () {
    return {
      navhome: 'Eco-assistant',
      isLogged:true
    }
      /*isLogged: this.checkIfIsLogged()
    }
  },
  created () {
    this.$bus.$on('logged', () => {
      this.isLogged = this.checkIfIsLogged()
    })
  },
  methods: {
    singout () {
      this.$localStorage.remove('access_token')
      this.isLogged = this.checkIfIsLogged()
      this.$router.push('/')
    },
    checkIfIsLogged () {
      let token = this.$localStorage.get('access_token')
      if (token) {
        return true
      } else {
        return false
      }*/
  }
}
</script>

  -->
