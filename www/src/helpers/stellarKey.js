import {Stellar} from '../../../lib/integration/stellar'

export default {
  isValidPublicKey (s) {
    try {
      Stellar.Keypair.fromPublicKey(s.trim())
    } catch (e) {
      console.error(`Invalid public key`)
      console.error(e)
      return false
    }
    return true
  },
  isValidSecretKey (s) {
    try {
      Stellar.Keypair.fromSecret(s.trim())
    } catch (e) {
      console.error(`Invalid secret key`)
      console.error(e)
      return false
    }
    return true
  },

}
