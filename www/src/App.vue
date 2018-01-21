<template>
  <div id="app">
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
  p, span {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
  }

  body {
    margin: 0;
    background-color: #f8f8f8;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    padding: 0;
  }

  .router-container {
    margin: 20px auto;
    width: 60%;
    min-width: 400px;
    max-width: 1080px;
    min-height: 400px;
    background-color: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, .5);
  }

  h1 {
    font-size: 24px;
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
  }

  .field {
    margin: 0px 0px;
  }

  input[type="submit"] {
    font-family: "Helvetica Neue", sans-serif;
    background-color: limegreen;
    font-size: 1.4em;
    margin: 1em 0;
    padding: 7px;
    width: 40%;
    max-width: 200px;
    height: 65px;
    cursor: pointer;
    border: transparent;
    border-radius: 3px;
  }

  .payment-size-input {
    font-size: 2em;
    padding: 5px 0px;
  }

  .input-label {
    font-weight: bold;
    margin: 1.3em auto 0.6em;
  }

  input {
    width: 85%;
    border-radius: 5px;
    font-size: 1.4em;
    padding: 10px 0;
    font-family: monospace;
    border: 1px #bbc0d3 solid;
    text-align: center;
  }

  input:focus {
    outline: none;
    border: 1px #54d0d3 solid;
  }

  input.error {
    border: red 1px solid;
  }

  p.error {
    color: red;
    margin-bottom: 0.3em;
  }

  .spinner {
    padding: 3em 0 4em;
  }

  .subdued {
    margin: 0.65em 0 0.35em;
  }

  a {
    cursor: pointer;
    color: #0001b6;
    font-size: 0.9em;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    color: #54d0d3;
  }

  h4 {
    margin: 0.5em 0 0.7em;
  }

  .statusText {
    margin-top: 8px;
    margin-bottom: 1.5em;
    color: rgb(85, 85, 85);
    font-size: 26px;
    text-align: center;
  }
</style>
