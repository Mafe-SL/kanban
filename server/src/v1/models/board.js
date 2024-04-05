const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const boardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  icon: {
    type: String,
    default: '📃'
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  description: {
    type: String,
    default: `Añade una descripción aquí
    🟢 Puedes añadir varias líneas de descripción
    🟢 Comienza ahora..`
  },
  position: {
    type: Number
  },
  favourite: {
    type: Boolean,
    default: false
  },
  favouritePosition: {
    type: Number,
    default: 0
  }
}, schemaOptions)

module.exports = mongoose.model('Board', boardSchema)