const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('apollo-server');
const http = require('http');

const { validateTokensMiddleware, validateAccessToken } = require('./token-utils');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}

const prisma = new PrismaClient()
const pubsub = new PubSub()
const corsConfig =
  process.env.NODE_ENV !== "production"
    ? {
      origin: "http://localhost:3000",
      credentials: true
    }
    : {
      origin: "https://your-website.com",
      credentials: true
    };

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req, res }) => {
    return {
      ...req,
      ...res,
      prisma,
      pubsub,
      userId: req.user
    };
  },
  subscriptions: {
    context: ({ req, connection }) => {
      console.log('subuser: ', req.user);
      console.log('subbody: ', req.body);
      return {
        ...req,
        ...connection,
        prisma,
        pubsub,
        userId: req.user
      }
    },
    onConnect: (connectionParams, webSocket, context) => {
      const user = validateAccessToken(connectionParams['authToken'])
      return {
        ...webSocket,
        prisma,
        pubsub,
        userId: { "id": user.userId }
      }
    },
    onOperation: (connectionParams, webSocket, context) => {
      console.log('porcaccia', connectionParams, webSocket, context)
    },
    onError: (connectionParams, webSocket, context) => {
      console.log('diobboe', connectionParams, webSocket, context)
    },
    onDisconnect: (webSocket, context) => {
      console.log('Disconnected!')
    },
    path: '/graphql',
  },
  cors: false
})

const app = express();
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(validateTokensMiddleware);

server.applyMiddleware({
  app,
  cors: false // <- ADD
});
// server.installSubscriptionHandlers(app);

expressServer = app.listen({ port: 4000 }, () => {
  console.log('🚀 Server ready at http://localhost:4000');
});
server.installSubscriptionHandlers(expressServer);
const subPath = server.subscriptionsPath;
console.log(`Subscriptions are at ws://localhost:4000${subPath}`);