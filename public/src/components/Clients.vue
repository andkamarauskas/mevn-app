<template>
  <div class="container">
    <div class="clients">
      <div v-html="message.client"></div>
      <div class="client-table">
        <div class="table-top-title bg-light">
          <span class="text-primary">Clients</span>
          <button class="btn btn-light new-client-button" v-on:click="showForm('new')">New Client</button>
        </div>
        <table class="table table-bordered">
          <thead class="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Providers</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(client, index) in clients" :key="client.id">
              <td>{{ client.name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.phone }}</td>
              <td>
                <span v-for="provider in client.providers" :key="provider.id">
                  {{ provider.name }}
                </span>
              </td>
              <td>
                <a href="#" v-on:click="editClient(index)">Edit</a>
                <a href="#" v-on:click="deleteClient(client._id,index)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="form" class="client-popup-form">
      <div class="form-header">
        <div class="form-name text-primary" v-html="formName"></div>
      </div>
      <div v-html="message.form"></div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right" for="name">Name:</label>
        <div class="col-sm-7">
          <input type="text" name="name" class="form-control" id="name" v-model="client.name">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right" for="email">Email:</label>
        <div class="col-sm-7">
          <input type="email" name="email" class="form-control" id="email" v-model="client.email">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right" for="phone">Phone:</label>
        <div class="col-sm-7">
          <input type="text" name="phone" class="form-control" id="phone" v-model="client.phone">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label text-right providers-label" for="provider">Providers:</label>
        <div class="col-sm-7">
          <input type="text" maxlength="14" v-model="newProviderName" name="provider" class="form-control provider-input" id="provider">
          <button class="btn btn-sm btn-light add-provider-btn" v-on:click="addProvider">Add Provider</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6 offset-sm-3">
          <ul class="providers-list" v-if="providers.length">
            <li v-for="(provider, index) in providers" :key="provider._id">
              <input class="form-check-input" type="checkbox" :value="provider._id" v-model="provider.checked">
              <input type="text" maxlength="14" :disabled="provider.edit ? false : true" class="provider-item input-disabled" name="providers[]" v-model="provider.name" @keyup.enter="updateProvider(provider)">
              <div class="providers-actions">
                <span class="icon-button" v-if="!provider.edit" v-on:click="editProvider(provider)"><icon name="edit"></icon></span>
                <span class="icon-button" v-else v-on:click="updateProvider(provider)"><icon name="save"></icon></span>
                <span class="icon-button" v-on:click="deleteProvider(provider._id , index)"><icon name="trash-alt"></icon></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-footer">
        <div v-if="!client.edit">
          <button class="btn btn-light form-button"  v-on:click="addNewClient">Add Client</button>
          <button class="btn btn-light form-button" v-on:click="closeForm">Cancel</button>
        </div>
        <div v-else>
          <button class="btn btn-danger form-button-del" v-on:click="deleteClient(client._id, index)">Delete Client</button>
          <button class="btn btn-light form-button" v-on:click="updateClient">Save Client</button>
          <button class="btn btn-light form-button" v-on:click="closeForm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ClientService from '@/services/ClientService'
import ProviderService from '@/services/ProviderService'

export default {
  name: 'clients',
  data () {
    return {
      clients: [],
      providers: [],
      newProviderName: '',
      providerInput: '',
      client: {
        providers: []
      },
      formName: '',
      form: false,
      message: {
        client: '',
        form: ''
      }
    }
  },
  mounted () {
    this.getClients()
    this.getProviders()
  },
  methods: {
    async getClients () {
      try {
        const response = await ClientService.fetchClients()
        this.clients = response.data
      } catch (err) {
        this.formMessage('client', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    async addNewClient () {
      this.mergeProviders()
      if (!this.dataValid()) { return }
      try {
        const response = await ClientService.addClient(this.client)
        this.clients.push(this.client)
        this.formMessage('client', 'success', response.data.message)
        this.clients[this.clients.length - 1]._id = response.data.client_id
        this.closeForm()
      } catch (err) {
        this.formMessage('form', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    dataValid () {
      if (this.client.name === undefined || this.client.name.length < 3) {
        this.formMessage('form', 'danger', 'Client name is too short')
        return false
      }
      if (this.client.email === undefined || !this.validateEmail(this.client.email)) {
        this.formMessage('form', 'danger', 'Email not valid')
        return false
      }
      if (this.client.phone === undefined || !this.validatePhone(this.client.phone)) {
        this.formMessage('form', 'danger', 'Phone number not valid')
        return false
      }
      if (this.client.providers.length === 0) {
        this.formMessage('form', 'danger', 'At least one provider must be checked')
        return
      }

      return true
    },
    validatePhone (phone) {
      var re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
      return re.test(phone)
    },
    validateEmail (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    editClient (index) {
      this.showForm('edit')
      this.client = this.clients[index]
      this.$set(this.client, 'edit', true)
      this.providers.map(provider => {
        this.client.providers.map(clientProvider => {
          if (provider._id === clientProvider._id) {
            this.$set(provider, 'checked', true)
          }
        })
      })
    },
    async updateClient () {
      try {
        this.client.providers = []
        this.mergeProviders()
        if (!this.dataValid()) { return }
        const response = await ClientService.updateClient(this.client._id, this.client)
        this.closeForm()
        this.formMessage('client', 'success', response.data.message)
      } catch (err) {
        this.formMessage('client', 'danger', err.response.data.message, err.response.data.error)
      }
      this.cleanMessage('form')
      this.uncheckProviders()
    },
    async deleteClient (id, index) {
      try {
        const response = await ClientService.deleteClient(id)
        this.clients.splice(index, 1)
        this.closeForm()
        this.formMessage('client', 'success', response.data.message)
      } catch (err) {
        this.formMessage('client', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    mergeProviders () {
      this.client.providers = []
      this.providers.map(provider => {
        if (provider.checked) {
          this.client.providers.push(provider)
        }
      })
    },
    async getProviders () {
      try {
        const response = await ProviderService.fetchProviders()
        this.providers = response.data
      } catch (err) {
        this.formMessage('form', 'danger', err)
      }
    },
    showForm (type) {
      this.form = true
      switch (type) {
        case ('new'):
          this.formName = 'New Client'
          break
        case ('edit'):
          this.formName = 'Edit Client'
          break
      }
    },
    closeForm () {
      this.client = {}
      this.client.providers = []
      this.newProviderName = ''
      this.uncheckProviders()
      this.cleanMessage('form')
      this.form = false
    },
    async addProvider () {
      if (this.newProviderName.length === 0) {
        this.formMessage('form', 'danger', 'Provider input can not be empty')
        return
      }

      try {
        const response = await ProviderService.addProvider({ name: this.newProviderName })
        this.providers.push({name: this.newProviderName})
        this.newProviderName = ''
        this.formMessage('form', 'success', response.data.message)
        this.providers[this.providers.length - 1]._id = response.data.provider_id
      } catch (err) {
        this.formMessage('form', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    editProvider (e) {
      this.providerInput = e.name
      this.$set(e, 'edit', true)
    },
    async updateProvider (e) {
      if (e.name === this.providerInput) { return this.$set(e, 'edit', false) }
      if (e.name.length === 0) {
        this.formMessage('form', 'danger', 'Input can not be empty')
        return
      }

      this.$set(e, 'edit', false)
      try {
        const response = await ProviderService.updateProvider(e._id, { name: e.name })
        this.formMessage('form', 'success', response.data.message)
      } catch (err) {
        this.formMessage('form', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    async deleteProvider (id, index) {
      try {
        const response = await ProviderService.deleteProvider(id)
        this.providers.splice(index, 1)
        this.formMessage('form', 'success', response.data.message)
      } catch (err) {
        this.formMessage('form', 'danger', err.response.data.message, err.response.data.error)
      }
    },
    formMessage (to, type, message, err) {
      if (err) {
        this.message[to] = '<div class="alert alert-' + type + '" role="alert">' +
        message +
        '<br>' +
        err +
        '</div>'
      } else {
        this.message[to] = '<div class="alert alert-' + type + '" role="alert">' + message + '</div>'
      }
    },
    cleanMessage (element) {
      this.message[element] = ''
    },
    uncheckProviders () {
      this.providers.map(provider => {
        provider.checked = false
      })
    }
  }
}
</script>
