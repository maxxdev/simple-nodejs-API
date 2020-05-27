import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

Vue.component(
  'loader', {
    template:
      '<div>Loading....</div>'
  }
)

new Vue({
  el: '#app',
  data() {
    return {
      form: {
        name: '',
        value: '',
        marked: false
      },
      loading: true,
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.value && this.form.name
    }
  },
  methods: {
    async createContact() {
      const {...contact} = this.form
      await request('/api/contacts', 'POST', contact)
      this.contacts = await request('/api/contacts')
      this.form.name = ''
      this.form.value = ''
    },
    async markContact(id) {
      let contact = this.contacts.find(c => c.id === id)
      const updated = await request(`/api/contacts/${id}`, 'PUT', {
        ...contact,
        marked: true
      })
      contact.marked = updated.marked
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, 'DELETE')
      this.contacts = await request('/api/contacts')
    }
  },
  async mounted() {
    this.contacts = await request('/api/contacts')
    this.loading = false
  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}
    let body
    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }
    const response = await fetch(url, {
      method,
      headers,
      body
    })

    return response.json()
  } catch (e) {
    console.warn('Error: ' + e.message)
  }
}