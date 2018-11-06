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
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if(!currentUser) {
        return null;
      }
      const user = await User.findOne({ username: currentUser.username })
        .populate({
          path: 'todos',
          model: 'Todos',
        });
      return user;
    }
  },
  Mutation: {
    addTodo: async (root, {
      name,
      category,
      description,
      due,
      username
    }, { Todos }) => {
      const newTodo = await new Todos({
        name,
        category,
        description,
        due,
        username
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
  },
};

