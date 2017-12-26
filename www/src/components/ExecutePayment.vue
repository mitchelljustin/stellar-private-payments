<template>
  <div class="body">
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
  .body {
    min-height: 400px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
