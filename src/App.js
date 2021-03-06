import React from 'react';
import './App.css';
import NavBar from './assets/components/NavBar'
import { Route, Switch } from "react-router-dom";
import About from "./About.js"
import Home from "./Home"
import Note from "./Note"



function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route component={Home} path="/" exact="true"/>
        <Route component={Note} path="/note" />
        <Route component={About} path = "/about" />
      </Switch>
    </div>
  );
}

export default App;
