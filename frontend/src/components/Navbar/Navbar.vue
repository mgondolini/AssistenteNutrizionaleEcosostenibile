<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand class="home" to="/">
          <img src="../../assets/ecology_f.png">{{navhome}}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="nav-router" is-nav>
          <b-navbar-nav>
            <router-link class="info_prod" to="info_prod">{{ $t('prod_info') }}</router-link>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="login" right v-if="this.$store.state.isLogged === false">
              Login
            </b-nav-item>
            <b-nav-item-dropdown right v-if="this.$store.state.isLogged === true">
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{ getUsername }}</em>
              </template>
                <b-dropdown-item href="profile">{{ $t('profile') }}</b-dropdown-item>
                <b-dropdown-item href="meals">{{ $t('meals') }}</b-dropdown-item>
                <b-dropdown-item href="new_meal">{{ $t('new_meal') }}</b-dropdown-item>
                <b-dropdown-item @click.prevent="signout">{{ $t('signout') }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown class="localeID" v-bind:text="$root.$i18n.locale" right>
              <b-dropdown-item-button
                v-for="(lang, i) in langs"
                :key="`Lang${i}`"
                :value="lang"
                @click="$root.$i18n.locale = lang">
                <img class="localeFlag" :src="getLocaleFlagPath(lang)">
                <span class="localeID"> {{ lang }} </span>
              </b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>
// const localeFlagsPath = '@/assets/flags/';
const localeFlagsExt = '.svg';
// If localeFlagsPath is passed instead of hardcoded path the function no longer works
const localeFlagsContext = require.context('@/assets/flags/', false);

export default {
  name: 'navbar',
  data() {
    return {
      navhome: 'Eco-assistant',
      langs: ['en', 'it'],
    };
  },
  computed: {
    getUsername() {
      return this.$store.state.username;
    },
  },
  methods: {
    getLocaleFlagPath(lang) {
      return localeFlagsContext(`./${lang}${localeFlagsExt}`);
    },
    signout() {
      localStorage.ecoAssToken = 'InvalidToken';
      this.$store.commit('logout');
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
};
</script>

<i18n>
{
  "en": {
    "prod_info": "Product informations",
    "user": "User",
    "profile": "My profile",
    "meals": "My last meals",
    "new_meal": "Insert new meal",
    "signout": "Signout"
  },
  "it": {
    "prod_info": "Informazioni prodotto",
    "user": "Utente",
    "profile": "Il mio profilo",
    "meals": "I miei ultimi pasti",
    "new_meal": "Inserisci nuovo pasto",
    "signout": "Esci"
  }
}
</i18n>
