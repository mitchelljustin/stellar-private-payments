<template>
  <div>
    <h1>Siyan</h1>
    <div class="spinner">
      <spinner v-if="showSpinner" size="big"></spinner>
      <icon v-if="!showSpinner" name="check" scale="4"></icon>
      <p class="statusText">
        {{ statusText }}
      </p>
      <div class="subdued" v-if="transactionHashes !== null">
        <h4>
          Transaction Hashes
          <a target="_blank" @click="toggleShowHashes">
            <icon name="chevron-down"></icon>
          </a>
        </h4>
        <div v-if="showHashes">
          <p v-for="hash in transactionHashes">
            <a :href="`https://stellarchain.io/tx/${hash}`">
              {{ hash }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MixingPayment',
    created() {
      this.startPayment()
    },
    data() {
      return {
        rootUid: this.$route.params.id,
        showSpinner: true,
        statusText: 'Mixing Payment...',
        transactionHashes: null,
        showHashes: false,
      }
    },
    methods: {
      startPayment() {
        setTimeout(() => {
          this.statusText = 'Payment Complete'
          this.showSpinner = false
          this.transactionHashes = [
            '59a5cfd78a15905d6c2b6437a8ac827a74e80e4596265f9c6befaa1a331095f6',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
          ]
        }, 4500)
      },
      toggleShowHashes() {
        this.showHashes = !this.showHashes
      }
    }
  }
</script>
