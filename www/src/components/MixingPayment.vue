<template>
  <div>
    <h5 class="subdued">
      Private Payment {{ rootUid }}
    </h5>
    <div class="spinner">
      <div class="bigSquare">
        <progress-bar type="circle"
                      ref="progress"
                      color="#373"
                      strokeWidth="2.5"
                      trailColor='#CCC'
                      trailWidth="2.5"
                      :options="{text: {value: '0/4'}}"
        />
      </div>
      <h3 class="statusText">
        <span v-if="!paymentCompleted">
          <icon name="spinner" pulse/> Sending
        </span>
        <span v-else>
          Payment Sent
        </span>
      </h3>
      <div class="transactions" v-if="transactionHashes !== null">
        <h4>
          <span class="anchorToggle">
            <a target="_blank" @click="toggleShowHashes">
              Transactions <icon name="chevron-down"/>
            </a>
          </span>
        </h4>
        <div v-if="showHashes">
          <p class="hash" v-for="hash in transactionHashes">
            <a :href="`https://stellar.expert/explorer/tx/${hash}`">
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
        paymentCompleted: false,
        transactionHashes: null,
        showHashes: false,
      }
    },
    methods: {
      startPayment() {
        setTimeout(() => {
          this.$refs.progress.animate(0.25)
          this.$refs.progress.setText('1/4')
        }, 2000)
        setTimeout(() => {
          this.$refs.progress.animate(0.5)
          this.$refs.progress.setText('2/4')
        }, 3000)
        setTimeout(() => {
          this.$refs.progress.animate(0.75)
          this.$refs.progress.setText('3/4')
        }, 4000)
        setTimeout(() => {
          this.$refs.progress.animate(1.0)
          this.$refs.progress.setText('4/4')
          this.paymentCompleted = true
          this.transactionHashes = [
            '59a5cfd78a15905d6c2b6437a8ac827a74e80e4596265f9c6befaa1a331095f6',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
            '59a5cfd78a15905d6c2b6437a8ac827a74e80e4596265f9c6befaa1a331095f6',
            '8e42954dc895c77b110f2e1cf4a71c3312eac3950f741b45485d4a1b16e28012',
          ]
        }, 5000)
      },
      toggleShowHashes() {
        this.showHashes = !this.showHashes
      }
    }
  }
</script>
