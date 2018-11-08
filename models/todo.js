const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString()
}

const TodoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    default: 'https://s3.amazonaws.com/photo-links/sosna.png',
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  due: {
    type: Date,
  },
  username: {
    type: String,
  },
  completion: {
    type: Number,
    default: 0,
  },
});

TodoSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Todos', TodoSchema);
