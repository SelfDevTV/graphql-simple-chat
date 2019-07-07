import React from "react";
import { Query, Subscription } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CHATS = gql`
  {
    chats {
      message
    }
  }
`;

const CHATS_SUBSCRIBE = gql`
  subscription {
    chatAdded {
      message
    }
  }
`;

// TODO: Fetch chats, and then subscribe and merge the comming chats to local state

function App() {
  return (
    <Subscription subscription={CHATS_SUBSCRIBE}>
      {({ data, loading }) => {
        console.log(data);
        if (loading) return <p>Loading</p>;

        return <h2>{data.chatAdded.message}</h2>;
      }}
    </Subscription>
  );
}

export default App;
