const CHAT_ADDED = "CHAT_ADDED";
const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

module.exports = {
  Query: {
    chats: (_, __, { Chat }) => Chat.find({}),
    chat: (_, { id }, { Chat }) => Chat.find(id),
    me: (_, __, context) => {
      return context.user;
    }
  },
  Mutation: {
    addChat: async (_, { message }, { Chat, user, User }) => {
      console.log("attempted to add chat. User: ", user);
      const userThatSentChat = await User.findById(user.id);

      const chat = new Chat({
        message,
        sentBy: user
      });

      await chat.save();

      userThatSentChat.chats.push(chat);
      await userThatSentChat.save();
      pubsub.publish(CHAT_ADDED, chat);

      return chat;
    },
    login: async (parent, { email, password }, context) => {
      console.log("login attempted with user and pw: ", email, password);
      const { user } = await context.authenticate("graphql-local", {
        email,
        password
      });

      context.login(user);
      return { user };
    },
    signup: async (parent, { email, password }, context) => {
      const userAlreadyExists = await context.User.findOne({ email });

      if (userAlreadyExists) throw new Error("User already exists");

      //TODO: make a mongoose model method to bcrypt the password
      const newUser = new context.User({
        email,
        password
      });

      await newUser.save();
      context.login(newUser);

      return { user: newUser };
    }
  },
  Subscription: {
    chatAdded: {
      resolve: chat => chat,
      subscribe: () => pubsub.asyncIterator([CHAT_ADDED])
    }
  },
  Chat: {
    _id: Chat => Chat.id,
    message: Chat => Chat.message,
    sentBy: async (chat, args, { Chat }) => {
      const foundChat = await Chat.findById(chat.id).populate("sentBy");
      return foundChat.sentBy;
    }
  },
  User: {
    email: User => User.email,
    chats: async (parent, args, { User, user }) => {
      const foundUser = await User.findById(user.id).populate("chats");
      console.log("This is the found user: ", foundUser);
      return foundUser.chats;
    }
  }
};
