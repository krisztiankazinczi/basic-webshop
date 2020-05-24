import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Header from './components/Header'
import UploadProductForm from './components/UploadProductForm' 
import UpdateProductForm from './components/UpdateProductForm' 
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Dashboard from './components/Dashboard.js'
import Products from './components/Products.js'
import CreateNewOffer from './components/CreateNewOffer'
import Offers from './components/Offers'
import Orders from './components/Orders'

function App() {
  return (
    <Router>
    <div>
      <Header/>
      <Switch>
        <Route path="/dashbord" component={Dashboard} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:sku" component={UpdateProductForm} />
        <Route path="/upload-product" component={UploadProductForm} />
        <Route path="/new-offer" component={CreateNewOffer} />
        <Route path="/offers" component={Offers} />
        <Route path="/orders" component={Orders} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </div>
  </Router>
  );
}

export default App;
