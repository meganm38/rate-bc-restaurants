<template>
  <div class="body">
    <NavbarVue/>
    <router-view :key="$route.path"/>
    <FooterVue class="footer"/>
  </div>
</template>

<script>
import NavbarVue from './components/NavBar.vue'
import FooterVue from './components/Footer.vue';

export default {
    components: { NavbarVue, FooterVue },
    setup() {


    }
  }

</script>

<style>
  body {
    background-repeat: repeat;
    background-position: top left;
    background-position-x: left;
    background-position-y: top;
    background-image: url(../src/assets/background.png);
  }

</style>
