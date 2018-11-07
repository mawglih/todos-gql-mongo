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
  }
});

TodoSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Todos', TodoSchema);
