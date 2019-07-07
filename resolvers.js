const CHAT_ADDED = "CHAT_ADDED";
const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const users = [
  {
    id: 1,
    email: "test@gmail.com",
    chats: [1]
  }
];

module.exports = {
  Query: {
    chats: (_, __, { Chat }) => Chat.find({}),
    chat: (_, { id }, { Chat }) => Chat.find(id),
    me: (_, __, context) => {
      console.log("the user is", context.user);
      return context.user;
    }
  },
  Mutation: {
    addChat: async (_, { message }, { Chat, user, User }) => {
      pubsub.publish(CHAT_ADDED, { chatAdded: message });
      console.log(user);
      const userThatSentChat = await User.findById(user.id);

      const chat = new Chat({
        message,
        sentBy: user
      });

      await chat.save();

      userThatSentChat.chats.push(chat);
      await userThatSentChat.save();

      return chat;
    },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate("graphql-local", {
        email,
        password
      });
      console.log("hiiiiiiiiii", user);
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
      subscribe: () => pubsub.asyncIterator([CHAT_ADDED])
    }
  },
  Chat: {
    message: Chat => Chat.message,
    sentBy: Chat => Chat.sentBy
  },
  User: {
    email: User => User.email,
    chats: User => User.chats
  }
};
