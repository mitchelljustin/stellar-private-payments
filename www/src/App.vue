<template>
  <div id="app">
    <h1>
      Siyan
    </h1>
    <div class="router-container">
      <router-view/>
    </div>
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
  body {
    margin: 0;
  }

  h1 {
    margin: 0 0 10px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #fafafa;
    height: 100vh;
    padding: 0;
  }

  .stellar-logo {
    width: 10%;
    height: 10%;
  }

  .router-container {
    margin: 0 auto;
    width: 60%;
    height: 80%;
    background-color: white;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, .5);
  }

  footer {

  }
</style>
