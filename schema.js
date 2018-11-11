exports.typeDefs = `
type Todos {
  _id: ID
  name: String!
  imageUrl: String!
  category: String!
  description: String
  createdDate: String
  due: String
  username: String
  completion: Int
}

type User {
  _id: ID!
  username: String!
  password: String!
  email: String!
  joinDate: String
  completed: [Todos]
}

type Query {
  getAllTodos: [Todos]
  getTodoItem(_id: ID!): Todos
  searchTodos(searchTerm: String): [Todos]
  getCurrentUser: User
  getUserTodos(username: String!): [Todos]
}

type Token {
  token: String!
}

type Mutation {
  addTodo(
    name: String!,
    imageUrl: String!,
    category: String!,
    description: String,
    due: String,
    username: String
    ): Todos
  
  signinUser(
    username: String!
    password: String!
  ): Token

  signupUser(
    username: String!
    email: String!
    password: String!
  ): Token

  deleteTodo(
    _id: ID!
  ): Todos

  updateTodo(
    _id: ID!
    username: String!
  ): Todos

  uncompleteTodo(
    _id: ID!
    username: String!
  ): Todos

  updateUserTodo(
    _id: ID!
    name: String!,
    imageUrl: String!,
    category: String!,
    description: String,
    due: String,
  ): Todos
}
`;
