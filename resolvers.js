exports.resolvers = {
  Query: {
    getAllTodos: async (root, args, { Todos }) => {
      const allTodos = await Todos.find();
      return allTodos;
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
    }
  },
};

