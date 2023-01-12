<template>
    <q-card class="card">
      <q-card-section>
        <img src="../assets/digitalprom/Logo.png"  class="logo">
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          @click="connect()"
          class="midata-fade full-width button"
          color="white"
          >Mit MIDATA verbinden</q-btn
        >
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginCard',
  methods: {

    connect() {
      this.$midata.authenticate();
      this.$storage.getPractitioner();    
    },
  },
});
</script>

<style>
.card{
    max-width: 600px;
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 20px;
}
.button{
  height: 200%;
  font-size: 200%;
}

</style>
