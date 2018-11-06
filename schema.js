exports.typeDefs = `
type Todos {
  _id: ID!
  name: String!
  category: String!
  description: String
  createdDate: String
  due: String
  username: String
}

type User {
  _id: ID!
  username: String!
  password: String!
  email: String!
  joinDate: String
  todos: [Todos]
}

type Query {
  getAllTodos: [Todos]
  getTodoItem(_id: ID!): Todos
  searchTodos(searchTerm: String): [Todos]
  getCurrentUser: User
}

type Token {
  token: String!
}

type Mutation {
  addTodo(
    name: String!,
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
}
`;
