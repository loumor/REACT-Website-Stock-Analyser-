import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PriceHistory from "./pages/Price History";
import Quotes from "./pages/Quotes";
import Stocks from "./pages/Stocks";

export default function App() {
  return (
    // Setup pages using the Switch function on react 
    // Use Route to target the path to the pages
    <Router>
    <div className="App">
      <Header />

      <Switch> 
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/stocks">
          <Stocks />
        </Route>

        <Route path="/quotes">
          <Quotes />
        </Route>

        <Route path="/price_history">
          <PriceHistory />
        </Route>
      </Switch>

      <Footer />
    </div>
    </Router>
  );
}
