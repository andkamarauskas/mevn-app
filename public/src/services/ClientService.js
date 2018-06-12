import Api from '@/services/Api'

export default {
  fetchClients () {
    return Api().get('getClients')
  },
  addClient (client) {
    return Api().post('newClient', client)
  },
  updateClient (id, client) {
    return Api().put('updateClient/' + id, client)
  },
  deleteClient (id) {
    return Api().delete('deleteClient/' + id)
  }
}
