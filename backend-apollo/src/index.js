const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('apollo-server');

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
const address = process.env.SERVER_ADDRESS

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
      origin: `http://${address}:3000`,
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
      newContext = {
        ...context,
        ...webSocket,
        prisma,
        pubsub,
        userId: { "id": user.userId }
      }
      console.log('Connected!', context.userId)
      return newContext
    },
    onOperation: (connectionParams, webSocket, context) => {
      console.log('Operation', connectionParams, webSocket, context)
    },
    onError: (connectionParams, webSocket, context) => {
      console.log('Error', connectionParams, webSocket, context)
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
  cors: false
});

expressServer = app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://${address}:4000`);
});
server.installSubscriptionHandlers(expressServer);
const subPath = server.subscriptionsPath;
console.log(`Subscriptions are at ws://${address}:4000${subPath}`);