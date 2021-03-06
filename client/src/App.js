import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/chat" component={Chat} />
    </Router>
  );
};

export default App;
