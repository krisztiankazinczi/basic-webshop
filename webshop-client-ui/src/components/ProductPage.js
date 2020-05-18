import React from 'react';

import Header from './Header/Header'

import Footer from './Footer/Footer'

import ProductDetails from './ProductDetails/ProductDetails.js'


const ProductPage = (props) => {

  return (
      <div>
        <Header />
        <ProductDetails sku={props.match.params.sku} />
        <Footer />
      </div>
    );
  

}

export default ProductPage;