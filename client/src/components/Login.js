import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Redirect } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");

  const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          email
        }
      }
    }
  `;

  console.log(LOGIN);

  return (
    <Mutation mutation={LOGIN}>
      {(login, { data, error }) => {
        if (data && data.login.user.email) {
          return <Redirect to="/chat" />;
        }
        console.log("the data is: ", data);
        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              login({ variables: { email, password: "" } });
              setEmail("");
            }}
          >
            <label>Email</label>
            <input
              type="text"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </form>
        );
      }}
    </Mutation>
  );
};

export default Login;
