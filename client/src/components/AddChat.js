import React, { useState } from "react";
import { Mutation } from "react-apollo";

const AddChat = ({ ADD_CHAT }) => {
  const [message, setMessage] = useState("");

  return (
    <Mutation mutation={ADD_CHAT}>
      {(addChat, { data }) => {
        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              addChat({ variables: { message } });
              setMessage("");
            }}
          >
            <label>Write a message and hit enter</label>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </form>
        );
      }}
    </Mutation>
  );
};

export default AddChat;
