const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Todos = require('./models/todo');
const User = require('./models/user');

//cors

const allowedOrigins = [
  'http://localhost:3000',
  'http://todo-with-graphql.s3-website-us-east-1.amazonaws.com'
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//JWT auth
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if(token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch(err) {
      console.error(err);
    }
  }
  next();
});

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
app.use('/graphql', bodyParser.json(), graphqlExpress(({ currentUser }) => ({
  schema,
  context: {
    Todos,
    User,
    currentUser,
  }
})));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});