import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import classes from './Cart.module.css'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';


const Cart = (props) => {


    return (
      <Grid container className={classes.GridContainer} direction="row" justify="center" >
        <Grid item lg={6}>
          <Typography variant="subtitle1">
            {props.cart.length ? `Total: ${props.totalValue} HUF` : 'Cart is empty' }
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Link to="/cart"><ShoppingCartIcon fontSize='large'></ShoppingCartIcon></Link>
        </Grid>
        <Grid item lg={2}>

        </Grid>
        <Grid item container lg={12} justify="center">
          <Grid item lg={12}>
            <ul className={classes.showme}> 
              {props.cart.length ?
                props.cart.map( (product, idx) => {
                return ( <li key={idx}>{product.pieces} x {product.name} = {product.price} HUF</li> )
                })
                : ''
              }
              {props.cart.length ? <hr></hr> : ''}
              {props.cart.length ? <li>Total = {props.totalValue} HUF</li> : '' } 
            </ul>
          </Grid>
        </Grid>
      </Grid>
    );

}


function mapStateToProps(state, props) {
  const cartValues = Object.values(state.cartReducer.cart)
  let totalValue = 0
  if (cartValues.length) {
    totalValue = cartValues.reduce( (total, actual) => total = total + actual.price, 0)
  } 
  // console.log('_____________________________________')
  // state.productsReducer.products.forEach(p => console.log(p.stock))
  return {
    cart: cartValues,
    totalValue
  }
}

export default connect(mapStateToProps)(Cart);




