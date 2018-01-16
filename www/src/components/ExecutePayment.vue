<template>
  <div class="body">
    <h2 class="header-title">Secret Payment</h2>
    <div class="field">
      <strong class="input-label">Source</strong>
      <p><input type="text"></p>
    </div>
    <div class="field">
      <strong class="input-label">Destination</strong>
      <p><input type="text"></p>
    </div>
    <div class="field">
      <strong class="input-label">Amount (XLM)</strong>
      <p><input type="text" class="payment-size-input"></p>
    </div>
    <div class="field">
      <strong class="input-label">Secret Key</strong>
      <p><input type="password"></p>
    </div>
    <div class="field">
      <button class="proceed">
        PROCEED ➡
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ExecutePayment',
    methods: {
      ping () {
        this.$http.get('ping')
          .then((res) => {
            this.msg += `${res.body}\n`
          })
      }
    },
    data () {
      return {
        msg: '---\n',
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-title {
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
  }

  .field {
    margin: 10px 0px;
  }

  .proceed {
    margin-top: 10px;
    background-color: limegreen;
    font-size: 1.4em;
    width: 35%;
    padding: 7px 0px;
    height: 75px;
    cursor: pointer;
    border: transparent;
    border-radius: 3px;
  }

  .payment-size-input {
    font-size: 2em;
    padding: 5px 0px;
  }

  .input-label {
    padding-bottom: 150px;
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

  input:focus{
    outline: none;
    border: 1px #54d0d3 solid;
  }
</style>
