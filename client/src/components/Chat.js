import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import AddChat from "./AddChat";

const ADD_CHAT = gql`
  mutation AddChat($message: String!) {
    addChat(message: $message) {
      message
      _id
      sentBy {
        _id
        email
      }
    }
  }
`;

const GET_CHATS = gql`
  {
    chats {
      _id
      message
      sentBy {
        _id
        email
      }
    }
  }
`;

const CHATS_SUBSCRIBE = gql`
  subscription {
    chatAdded {
      _id
      message
      sentBy {
        _id
        email
      }
    }
  }
`;

let sub = null;

function App() {
  return (
    <Query query={GET_CHATS}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <p>Loading</p>;
        if (!sub) {
          sub = subscribeToMore({
            document: CHATS_SUBSCRIBE,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const { chatAdded } = subscriptionData.data;
              return {
                ...prev,
                chats: [...prev.chats, chatAdded]
              };
            }
          });
        }

        console.log("data: ", data);
        return (
          <div>
            {data.chats.map(chat => (
              <div key={chat._id}>
                <p>Users: {chat.sentBy && chat.sentBy.email}</p>
                <p>Message: {chat.message}</p>
              </div>
            ))}
            <AddChat ADD_CHAT={ADD_CHAT} />
          </div>
        );
      }}
    </Query>
  );
}

export default App;
