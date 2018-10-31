const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Todos = require('./models/todo');
const User = require('./models/user');

//cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
}
app.use(cors(corsOptions));

//graphql
const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

require('dotenv').config({path: 'variables.env'});
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;
const MONGO_URI = `mongodb://${username}:${password}@${dbUrl}`;
const port = process.env.PORT || 4444;

mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}));
//connect schema to graphql
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: {
    Todos,
    User,
  }
}));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});