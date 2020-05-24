import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { connect } from 'react-redux';

import Home from './components/Home'
import ProductPage from './components/ProductPage'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import * as ACTIONS from './store/actions/actions';



class App extends React.Component {

  componentDidMount() {
    fetch('http://localhost:5000/productsToClients', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.props.getProductsFromServer({ products: res.products })
        this.props.getOffersFromServer({ offers: res.offers })
      })
  }

  render() {

    if (!this.props.offers.length) return (<div></div>)

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

function mapStateToProps(state) {
  return {
    offers: state.offeringReducer.offers
  }
}


function mapDispatchToProps(dispatch) {
  return {
    getProductsFromServer: (payload) => dispatch(ACTIONS.getProductsFromServer(payload)),
    getOffersFromServer: (payload) => dispatch(ACTIONS.getOffersFromServer(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);