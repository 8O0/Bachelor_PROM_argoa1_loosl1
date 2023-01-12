<template>
  <q-page class="wrapper">
    <h1>Vielen Dank.</h1>
    <h4>Sie dürfen das Tablet zurückgeben.</h4>
    <q-btn
      class="button"
      color="primary"
      id="completeBtn"
      label="Zurück"
      size="20px"
      to="/search"
    />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
};
</script>

<style lang="scss" scoped>

.button{
  height: 200%;
  font-size: 200%;
}

.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 60px;
    margin-bottom: 0;
  }
  h4 {
    font-size: 30px;
  }
}

</style>