<template>
  <div id="app">
    <h2>
      Private Payments on
      <a href="https://www.stellar.org">
        <img src="./assets/stellar.png" class="stellar-logo" alt="Stellar">
      </a>
    </h2>
    <hr>
    <router-view/>
    <hr>
    <footer>
      <small>Donations welcome. Stellar address: <strong>mitch*lobstr.co</strong></small>
    </footer>

  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .stellar-logo {
    width: 33%;
    height: 33%;
  }
</style>
