import React from 'react';

import Header from './Header/Header'

import Footer from './Footer/Footer'
import CartSummary from './CartSummary/CartSummary'

const CartPage = () => {

  return (
    <div>
      <Header />
      <CartSummary />
      <Footer />
    </div>
  );

}

export default CartPage;