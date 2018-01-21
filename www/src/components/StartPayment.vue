<template>
  <form method="POST" target="_blank">
    <h1>Siyan</h1>
    <h2>Private Payment</h2>
    <div class="field">
      <p class="input-label">
        <label for="source">
          Source
        </label>
      </p>
      <div>
        <p v-if="errors.source" class="error">
          {{ errors.source }}
        </p>
        <input type="text"
               :class="{error: errors.source}"
               v-model="form.source"
               id="source">
      </div>
    </div>
    <div class="field">
      <p class="input-label">
        <label for="destination">
          Destination
        </label>
      </p>
      <div>
        <p v-if="errors.destination" class="error">{{ errors.destination }}</p>
        <input type="text"
               :class="{error: errors.destination}"
               v-model="form.destination"
               id="destination">
      </div>
    </div>
    <div class="field">
      <p class="input-label">
        <label for="secretKey">
          Secret Key
        </label>
      </p>
      <div>
        <p v-if="errors.secretKey" class="error">{{ errors.secretKey }}</p>
        <input :type="secretKeyInputType"
               :class="{error: errors.secretKey}"
               @focus="showSecretKey"
               @blur="hideSecretKey"
               v-model="form.secretKey"
               id="secretKey">
      </div>
    </div>
    <div class="field">
      <p class="input-label">
        <label for="size">
          Amount (XLM)
        </label>
      </p>
      <div>
        <p v-if="errors.size" class="error">{{ errors.size }}</p>
        <input type="number"
               v-model="form.size"
               id="size"
               step="0.0000001"
               :class="[{error: errors.size}, 'payment-size-input']">
      </div>
    </div>
    <div>
      <input @click="proceed" id="submit" type="submit" value="PROCEED ➡">
    </div>
  </form>
</template>

<script>
  import signingPrivPmt from '../../../lib/helpers/signingPrivPmt'
  import stellarKey from '../helpers/stellarKey'

  export default {
    name: 'StartPayment',
    data() {
      return {
        secretKeyInputType: 'password',
        errors: {
          source: null,
          destination: null,
          size: null,
          secretKey: null,
        },
        form: {
          source: '',
          destination: '',
          size: '',
          secretKey: '',
        }
      }
    },
    methods: {
      showSecretKey() {
        this.secretKeyInputType = 'text'
      },
      hideSecretKey() {
        this.secretKeyInputType = 'password'
      },
      validate({fieldName, validator, errorMsg}) {
        if (!validator(this.form[fieldName])) {
          this.errors[fieldName] = errorMsg
        }
      },
      proceed(e) {
        e.preventDefault()
        this.validate({
          fieldName: 'source',
          validator: stellarKey.isValidPublicKey,
          errorMsg: 'Invalid public key'
        })
        this.validate({
          fieldName: 'destination',
          validator: stellarKey.isValidPublicKey,
          errorMsg: 'Invalid public key'
        })
        this.validate({
          fieldName: 'secretKey',
          validator: stellarKey.isValidSecretKey,
          errorMsg: 'Invalid secret key'
        })
        if (this.hasErrors) {
          return
        }
        let {source, destination, size, secretKey} = this.form

        let payment = {source, destination, size}
        payment.signature = signingPrivPmt.sign(payment, secretKey)
        this.$http.post('private_payment', payment)
          .then((res) => {
            let {id} = res.body
            this.$router.push({
              name: 'MixingPayment',
              params: {id}
            })
          })
          .catch((e) => {
            alert(`Error with mix payment: ${JSON.stringify(e)}`)
          })
      },
    },
    computed: {
      hasErrors() {
        return Object.values(this.errors).some(e => e !== null)
      },
    },
    watch: {
      'form.source': function () {
        this.errors.source = null
      },
      'form.destination': function () {
        this.errors.destination = null
      },
      'form.size': function () {
        this.errors.size = null
      },
      'form.secretKey': function () {
        this.errors.secretKey = null
      },
    }

  }
</script>
