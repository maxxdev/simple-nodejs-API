const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

app.use(express.json())

let CONTACTS = [
  {id: '1', name: 'Leonardo', value: '820954413', marked: false}
]

const CONTACT_ROUTE = '/api/contacts'

//SetTimeout for simulate delay betwen request and response from server when data is huge
//GET
app.get(CONTACT_ROUTE, (req, res) => {
  setTimeout(() => {
    res.status(200).json(CONTACTS)
  }, 1000)
})
//POST
app.post(CONTACT_ROUTE, (req, res) => {
  const contact = {...req.body, id: v4(), marked: false}
  CONTACTS.push(contact)
  res.status(201).json(contact)
})
//DELETE
app.delete(CONTACT_ROUTE + '/:id', (req, res) => {
  CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
  res.status(200).json({message: 'Removed successfully'})
})
//UPDATE
app.put(CONTACT_ROUTE + '/:id', (req, res) => {
  const idx = CONTACTS.findIndex(c => c.id === req.params.id)
  CONTACTS[idx] = req.body
  res.json(CONTACTS[idx])
})


app.use(express.static(path.resolve(__dirname, 'client')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})
app.listen(3000, () =>
  console.log('Server has been started on port 3000...'))
