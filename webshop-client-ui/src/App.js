import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './components/Home'
import ProductPage from './components/ProductPage'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'


class App extends React.Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/product/:sku" component={ProductPage} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    );
  }

}

export default App;
