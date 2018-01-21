<template>
  <div>
    <h2>New Payment</h2>
    <v-dialog height="auto"/>
    <div class="field">
      <p class="input-label">
        <label for="destination">
          Destination Account
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
    <div class="field" style="display: none">
      <p class="input-label">
        <label for="source">
          Source Account
        </label>
      </p>
      <div>
        <input type="text"
               disabled
               v-model="form.source"
               id="source">
      </div>
    </div>
    <div class="field">
      <div class="paired">
        <div class="amount">
          <p class="input-label">
            <label for="size">
              Amount (XLM)
            </label>
          </p>
          <p v-if="errors.size" class="error">{{ errors.size }}</p>
          <input type="number"
                 v-model="form.size"
                 id="size"
                 step="5"
                 min="5"
                 :class="[{error: errors.size}, 'payment-size-input']">
        </div>
        <div class="proceed">
          <input @click="proceed" id="submit" type="submit" value="GO">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import signingPrivPmt from '../../../lib/helpers/signingPrivPmt'
  import convertStroops from '../../../lib/helpers/convertStroops'
  import stellarKey from '../helpers/stellarKey'
  import {Stellar} from '../../../lib/integration/stellar'

  function checkPaymentSize(size) {
    if (size === '') {
      return 'Amount is empty'
    }
    try {
      convertStroops.fromString(size)
    } catch (e) {
      return e.message
    }
    return null
  }

  export default {
    name: 'StartPayment',
    data() {
      return {
        secretKeyInputType: 'password',
        errors: {
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
        this.validate({
          fieldName: 'secretKey',
          validator: stellarKey.checkSecretKey,
        })
        if (this.errors.secretKey === null) {
          this.form.source = Stellar.Keypair.fromSecret(this.form.secretKey).publicKey()
        } else {
          this.form.source = ''
        }
      },
      validate({fieldName, validator}) {
        let value = this.form[fieldName]
        let errorMsg
        if (value === '') {
          errorMsg = 'Empty'
        } else {
          errorMsg = validator(value)
        }
        if (errorMsg !== null) {
          this.errors[fieldName] = `Invalid ${fieldName}: ${errorMsg}`
        }
      },
      proceed(e) {
        e.preventDefault()
        this.validate({
          fieldName: 'destination',
          validator: stellarKey.checkPublicKey,
        })
        this.validate({
          fieldName: 'secretKey',
          validator: stellarKey.checkSecretKey,
        })
        this.validate({
          fieldName: 'size',
          validator: checkPaymentSize,
        })
        if (this.hasErrors) {
          return
        }
        let {source, destination, size, secretKey} = this.form

        let payment = {source, destination, size}
        payment.signature = signingPrivPmt.sign(payment, secretKey)
        let payFunction = () => {
          this.$modal.hide('dialog')
          this.$http.post('api/private-payment', payment)
            .then((res) => {
              let {id} = res.body
              this.$router.push({
                name: 'MixingPayment',
                params: {id}
              })
            })
            .catch((e) => {
              this.$modal.show('dialog', {
                title: 'Error',
                text: `Error with payment: ${JSON.stringify(e.body)}`,
                buttons: [
                  {
                    title: 'Close',
                  }
                ]
              })
            })
        }
        let sourceTrunc = payment.source.slice(0, 8) + '..' + payment.source.slice(payment.source.length - 8)
        let destinationTrunc = payment.destination.slice(0, 8) + '..' + payment.destination.slice(payment.destination.length - 8)
        this.$modal.show('dialog', {
          title: 'Confirm',
          text: `Pay ${size} XLM \nfrom ${sourceTrunc} \nto ${destinationTrunc}?`,
          buttons: [
            {
              title: 'Pay',
              default: true,
              handler: payFunction,
            },
            {
              title: 'Close',
            },
          ]
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
