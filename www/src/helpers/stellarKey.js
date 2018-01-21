import {Stellar} from '../../../lib/integration/stellar'

export default {
  checkPublicKey (s) {
    try {
      Stellar.Keypair.fromPublicKey(s.trim())
    } catch (e) {
      return e.message
    }
    return null
  },
  checkSecretKey (s) {
    try {
      Stellar.Keypair.fromSecret(s.trim())
    } catch (e) {
      return e.message
    }
    return null
  },

}
