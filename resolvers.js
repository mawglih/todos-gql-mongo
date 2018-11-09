const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllTodos: async (root, args, { Todos }) => {
      const allTodos = await Todos.find().sort({
        createdDate: 'desc'
      });
      return allTodos;
    },
    getTodoItem: async (root, { _id }, { Todos }) => {
      const TodoItem = await Todos.findOne({ _id });
      return TodoItem;
    },
    searchTodos: async (root, { searchTerm }, { Todos }) => {
      if(searchTerm) {
        const searchResults = await Todos.find({
          $text: { $search: searchTerm },
        }, {
          score: { $meta: "textScore"}
        }).sort({
          score: { $meta: "textScore"}
        });
        return searchResults;
      } else {
        const todos = await Todos.find().sort({due: 'desc'});
        return todos;
      }
    },
    getUserTodos: async (root, { username }, {Todos}) => {
      const userTodos = await Todos.find({ username }).sort({ createdDate: 'desc'});
      return userTodos;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if(!currentUser) {
        return null;
      }
      const user = await User.findOne({ username: currentUser.username })
        .populate({
          path: 'completed',
          model: 'Todos',
        });
      return user;
    }
  },
  Mutation: {
    addTodo: async (
      root, 
        { name, category, imageUrl, description, due, username, completion, },
        { Todos }
    ) => {
      const newTodo = await new Todos({
        name,
        category,
        description,
        imageUrl,
        due,
        username,
        completion,
      }).save();
      return newTodo;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if(!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if(!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr')}
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if(user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr')}
    },
    deleteTodo: async (root, { _id }, { Todos }) => {
      const todo = await Todos.findOneAndRemove({ _id });
      return todo;
    },
    updateTodo: async (root, { _id, username }, { Todos, User }) => {
      const todo = await Todos.findOneAndUpdate({ _id }, { $set: { completion: 1 }});
      const user = await User.findOneAndUpdate({ username }, { $addToSet: { completed: _id }});
      return todo;
    },
    uncompleteTodo: async (root, { _id, username }, { Todos, User }) => {
      const todo = await Todos.findOneAndUpdate({ _id }, { $set: { completion: 0 }});
      const user = await User.findOneAndUpdate({ username }, { $pull: { completed: _id }});
      return todo;
    },
  },
};
