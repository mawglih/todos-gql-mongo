const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    default: Date.now,
  },
  due: {
    type: Date,
  },
  username: {
    type: String,
  }
});

module.exports = mongoose.model('Todos', TodoSchema);
