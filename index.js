const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
const passport = require("passport");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const http = require("http");
const User = require("./models/User");
const Chat = require("./models/Chat");

mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => console.log("connected to db"));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const user = await User.findOne({ email });

    const error = user ? null : new Error("no matching user");
    done(error, user);
  })
);

const PORT = 4000;

const app = express();

app.use(
  session({
    secret: "testsecret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      return buildContext({ User, Chat, req, res });
    }
  },
  //   subscriptions: {
  //     onConnect: async (connectionParams, webSocket, { request }) => {
  //       console.log(request);
  //     }
  //   },
  playground: {
    settings: {
      "request.credentials": "include"
    }
  }
});

server.applyMiddleware({ app, cors: false });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(
    `Server is running on http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(`ws://localhost:${PORT}${server.subscriptionsPath}`);
});
