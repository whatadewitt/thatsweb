import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import "./App.css";
import Footer from "./components/footer";
import Home from "./components/home";
import MemeTool from "./components/memetool";
import MemeList from "./components/memelist";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <div className="thatsweb">
            <Route exact path="/" component={Home} />
            <Route path="/tool" component={MemeTool} />
            <Route path="/memes" component={MemeList} />
            <Footer />
          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
