<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand class="home" to="/">
          <img src="../../assets/ecology_f.png">{{navhome}}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="nav-router" is-nav>
          <b-navbar-nav>
            <router-link class="info_prod" to="info_prod">Informazioni prodotto</router-link>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="login" right v-if="isLogged === false">Login</b-nav-item>
            <b-nav-item-dropdown right v-if="isLogged === true">
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>User</em>
              </template>
                <b-dropdown-item href="#">Il mio profilo</b-dropdown-item>
                <b-dropdown-item href="#">I miei ultimi pasti</b-dropdown-item>
                <b-dropdown-item href="#">Inserisci nuovo pasto</b-dropdown-item>
                <b-dropdown-item @click.prevent="singout">Esci</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
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

<!--
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
