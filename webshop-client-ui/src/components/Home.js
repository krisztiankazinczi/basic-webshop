import React from 'react';

import Header from './Header/Header'
import Carousel from './Carousel/Carousel'
import ProductList from './ProductList/ProductList'
import Footer from './Footer/Footer'



const Home = () => {

    return (
      <div>
        <Header />
        <Carousel />
        <ProductList />
        <Footer />
      </div>
    );

}

export default Home;