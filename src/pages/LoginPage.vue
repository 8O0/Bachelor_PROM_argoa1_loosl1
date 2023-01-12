<template>

  <q-page class="wrapper">
      <login-card></login-card>
  </q-page>
</template>

<script>
import LoginCard from '../components/LoginCard.vue';
export default {
  name: 'LoginPage',
  components: {
    'login-card': LoginCard,

  },
}
</script>
<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    display: flex;
    justify-content: center;

  }

</style>
