import Api from '@/services/Api'

export default {
  fetchProviders () {
    return Api().get('getProviders')
  },
  addProvider (params) {
    return Api().post('newProvider', params)
  },
  updateProvider (id, params) {
    return Api().put('updateProvider/' + id, params)
  },
  deleteProvider (id) {
    return Api().delete('deleteProvider/' + id)
  }
}
