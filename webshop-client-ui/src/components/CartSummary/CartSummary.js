import React from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


import classes from './CartSummary.module.css'

import CartItem from './CartItem'
import Finalize from './Finalize'


const CartSummary = (props) => {

  return (
    <Grid container className={classes.MainContainer} direction="row" justify="center">
      {
        props.productsInCart.length
          ?
            <Grid className={classes.Title} item lg={12} align="center">
              <Typography variant="h3" className={classes.center}>Your order</Typography>
            </Grid>
          :
            ""
        }
      {props.productsInCart.length
        ?
        props.productsInCart.map(product => {
          return (<CartItem product={product} key={product.sku} />)
        })
        :
        <Typography color="secondary" variant="h3" className={classes.center}>Your cart is empty</Typography>
      }
      <Grid className={classes.Border} item lg={12} align="center">
        <Finalize totalPrice={props.totalValue} skuAndPiecesInCart={props.skuAndPiecesInCart} />
      </Grid>
    </Grid>
  );

}



function mapStateToProps(state) {
  const productsInCart = []
  const cartItems = Object.keys(state.cartReducer.cart)

  if (cartItems.length) {
    state.productsReducer.products.forEach(product => {
      cartItems.forEach(sku => {
        if (sku === product.sku) {
          productsInCart.push({
            name: product.name,
            sku: product.sku,
            pieces: state.cartReducer.cart[sku].pieces,
            subTotal: state.cartReducer.cart[sku].price,
            image: product.images.find(image => image.isPrimary === true) ? product.images.find(image => image.isPrimary === true).path : undefined,
            stock: product.stock,
            price: product.price
          })
        }
      })
    })
  }

  const totalValue = Object.values(state.cartReducer.cart).reduce((total, actual) => total = total + actual.price, 0)

  const skuAndPiecesInCart = productsInCart.map(product => { return { sku: product.sku, pieces: product.pieces } })

  return {
    productsInCart,
    totalValue,
    skuAndPiecesInCart
  }
}

export default connect(mapStateToProps)(CartSummary);
