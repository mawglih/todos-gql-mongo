exports.typeDefs = `
type Todos {
  _id: ID
  name: String!
  category: String!
  description: String
  createdDate: String
  due: String
  username: String
}
type User {
  _id: ID
  username: String!
  password: String!
  email: String!
  joinDate: String
  todos: [Todos]
}
type Query {
  getAllTodos: [Todos]
}
type Mutation {
  addTodo(
    name: String!,
    category: String!,
    description: String,
    due: String,
    username: String
    ): Todos
}
`;
