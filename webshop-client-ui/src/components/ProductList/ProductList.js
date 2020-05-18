import React from 'react';
import { connect } from 'react-redux';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import ProductBox from '../ProductBox/ProductBox'


const ProductList = (props) => {
    return (
      <GridList cellHeight={350} cols={4}>
        {props.products.map((product, idx) => (
          <GridListTile key={product.sku + idx}>
            <ProductBox image={product.images[0].path} alt={product.name} name={product.name} sku={product.sku} price={product.price} />
          </GridListTile>
        ))}
      </GridList>
    );
}

function mapStateToProps(state) {
  return {
    products: state.productsReducer.products
  }
}

export default connect(mapStateToProps, null)(ProductList);
