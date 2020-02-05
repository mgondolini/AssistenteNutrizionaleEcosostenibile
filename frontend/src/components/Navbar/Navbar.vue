<template>
    <div>
      <b-navbar class="navbarChangeColor" toggleable="lg" type="dark" :variant="this.variant">
        <b-icon class="backIcon border rounded" icon="arrow-left-short"
        font-scale="2.5" @click='back'></b-icon>
        <b-navbar-brand class="home" to="/" aria-label="home">
          <img src="../../assets/ecology_f.png" alt="imageLogo">{{navhome}}
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" class="nav-router" is-nav>
          <b-navbar-nav>
            <b-nav-item to="" class="info_prod" @click="productInfo()">
              {{ $t('prod_info') }}
            </b-nav-item>
          </b-navbar-nav>


          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item class="loginSpan"
            to="login" right v-if="this.$store.state.isLogged === false">
              Login
            </b-nav-item>
            <b-nav-item-dropdown right v-if="this.$store.state.isLogged === true">
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{ getUsername }}</em>
              </template>
                <b-dropdown-item href="profile">{{ $t('profile') }}</b-dropdown-item>
                <b-dropdown-item href="meals">{{ $t('meals') }}</b-dropdown-item>
                <b-dropdown-item @click.prevent="signout">{{ $t('signout') }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown class="localeID" v-bind:text="$root.$i18n.locale" right>
              <b-dropdown-item-button
                v-for="(lang, i) in langs"
                :key="`Lang${i}`"
                :value="lang"
                @click="$root.$i18n.locale = lang">
                <img class="localeFlag" :src="getLocaleFlagPath(lang)" alt="flag">
                <span class="localeID"> {{ lang }} </span>
              </b-dropdown-item-button>
            </b-nav-item-dropdown>
            <b-nav-item>
              <b-icon class="backIcon border rounded" :icon="nameIcon"
                font-scale="2" @click='changeIcon'></b-icon>
            </b-nav-item>
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
      nameIcon: 'sun',
      variant: 'info',
    };
  },
  mounted() {
    this.assignClass();
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
    assignClass() {
      const p = document.getElementById('app');
      const p2 = document.getElementById('parentAll');
      if (this.$store.state.darkMode) {
        this.nameIcon = 'moon';
        this.variant = 'dark';
        p.classList.add('dark');
        p2.classList.add('dark');
        p.classList.remove('light');
        p2.classList.remove('light');
      } else {
        this.nameIcon = 'sun';
        this.variant = 'info';
        p.classList.remove('dark');
        p2.classList.remove('dark');
        p.classList.add('light');
        p2.classList.add('light');
      }
    },
    changeIcon() {
      this.$store.commit('switchMode');
      this.assignClass();
    },
    back() {
      this.$router.go(-1);
    },
    signout() {
      this.$store.commit('logout');
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    productInfo() {
      this.$root.$emit('openProductSelection');
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
    "signout": "Signout"
  },
  "it": {
    "prod_info": "Informazioni prodotto",
    "user": "Utente",
    "profile": "Il mio profilo",
    "meals": "I miei ultimi pasti",
    "signout": "Esci"
  }
}
</i18n>
