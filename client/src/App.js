import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const GET_CHATS = gql`
  {
    chats {
      message
    }
  }
`;

function App() {
  return (
    <Query query={GET_CHATS}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading</p>;
        return data.chats.map(chat => {
          return <p>{chat.message}</p>;
        });
      }}
    </Query>
  );
}

export default App;
