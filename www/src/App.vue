<template>
  <div id="app">
    <div class="router-container">
      <h1>
        <router-link :to="{name: 'StartPayment'}">
          Siyan
          <small> - Private Payments on Stellar</small>
        </router-link>
      </h1>
      <hr>
      <router-view/>
    </div>
    <footer>
      <p>
        Donations welcome at
        <span class="anchorToggle"><a href="#" @click="toggleAccountId">mitch*siyan.io</a></span>.
        Source on <a href="https://github.com/mvanderh/stellar-private-payments">GitHub</a>
      </p>
      <p v-if="showAccountId">
        <small>Account ID: GCKM47OW2UEHYHP3C2WIZKHEE2SECPO4QVM5CNQOHTSPV6LZPG34CARO</small>
      </p>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        showAccountId: false,
      }
    },
    methods: {
      toggleAccountId() {
        this.showAccountId = !this.showAccountId
      }
    }
  }
</script>

<style>
  p, span {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
  }

  hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0));
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
    margin: 1em auto;
    width: 60%;
    padding: 16px 30px;
    min-width: 300px;
    max-width: 1080px;
    background-color: #FEFEFE;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, .5);
  }

  h1 {
    font-size: 26px;
    width: 100%;
  }

  .field {
    margin: 0px 0px;
  }

  input[type="submit"], button {
    font-family: "Helvetica Neue", sans-serif;
    font-size: 1.2em;
    color: #3e3e3e;
    background-color: #8ccb8f;
    width: 100%;
    height: 55px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    outline: none;
  }

  input[type="submit"]:active, button:active {
    background-color: #81bb84;
    outline: none;
  }

  .payment-size-input {
    font-size: 2em;
    width: 100%;
    padding: 5px 0px;
  }

  .input-label {
    font-weight: bold;
    font-size: 15px;
    margin: 1.3em auto 0.6em;
  }

  input {
    width: 100%;
    border-radius: 5px;
    font-size: 1.4em;
    padding: 10px 0;
    font-family: monospace;
    border: 1px #bbc0d3 solid;
    text-align: center;
  }

  input:disabled {
    background: #f8f8f8;
  }

  input[type="text"]:focus, input[type="password"]:focus, input[type="number"]:focus {
    outline: none;
    border: 1px #54d0d3 solid;
  }

  input.error {
    border: red 1px solid;
  }

  p.hash {
    font-size: 1.2vmax;
    text-align: center;
  }

  p.error {
    color: red;
    margin-bottom: 0.3em;
  }

  .subdued {
    margin: 0.65em 0 0.35em;
    color: #888;
    font-weight: normal;
  }

  a {
    cursor: pointer;
    color: #0001b6;
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
    font-weight: normal;
  }

  .bigSquare {
    width: 100px;
    height: 100px;
    margin: 1em auto;
  }

  .progressbar-text {
    font-weight: 700;
  }

  footer {
    font-size: 0.9em;
  }

  .anchorToggle {
    font-weight: 600;
    border: 1px #e4e4e4 solid;
    border-radius: 3px;
    padding: 0.1em 0.3em 0;
  }

  .paired {
    display: flex;
    width: 100%;
    margin: 0.3em auto 0.5em;
    justify-content: space-between;
    align-items: flex-end;
  }

  .amount {
    width: 60%;
  }

  .proceed {
    width: 30%;
  }
</style>
