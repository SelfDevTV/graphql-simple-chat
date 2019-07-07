const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    chats: [Chat]!
    chat(id: ID!): Chat
    me: User
  }

  type Mutation {
    addChat(message: String!): Chat!
    login(email: String!, password: String!): AuthPayload
    signup(email: String!, password: String!): AuthPayload
  }

  type Subscription {
    chatAdded: Chat
  }

  type AuthPayload {
    user: User
  }

  type Chat {
    _id: ID!
    message: String!
    sentBy: User
  }

  type User {
    _id: ID!
    email: String
    chats: [Chat]!
  }
`;

module.exports = typeDefs;
