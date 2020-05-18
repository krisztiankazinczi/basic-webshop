import React from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import classes from './Finalize.module.css'

import * as ACTIONS from '../../store/actions/actions';


const Finalize = (props) => {

  const emptyCart = () => {
    if (props.isCartNotEmpty) {
      props.setStockBack(props.skuAndPiecesInCart)
      props.emptyCart()
    }
  }

  return (
    <Grid container className={classes.Container} direction="row" justify="center">
      <Grid item container lg={12}>
        <Grid item lg={8}></Grid>
        <Grid item lg={1}>
          <Typography variant="h4">Total: </Typography>
        </Grid>
        <Grid item lg={2} align="end">
          <Typography variant="h4">{props.totalPrice} HUF</Typography>
        </Grid>
        <Grid item lg={1}></Grid>
      </Grid>
      <Grid item container lg={12}>
        <Grid item lg={1}></Grid>
        <Grid item lg={3}>
          {
            props.isCartNotEmpty
              ?
                <Button onClick={() => emptyCart()} className={classes.buttons} size="large" color="secondary" variant="contained">
                  Empty Cart
                </Button>
              :
                ""
          }

        </Grid>
        <Grid item lg={4}></Grid>
        <Grid item lg={3}>
          {
            props.isCartNotEmpty
              ?
                <Link to="/checkout">
                  <Button className={classes.buttons} size="large" color="primary" variant="contained">
                    Checkout
                  </Button>
                </Link>
              :
                ""
          }

        </Grid>
        <Grid item lg={1}></Grid>
      </Grid>
    </Grid>
  );

}



function mapStateToProps(state, props) {
  return {
    isCartNotEmpty: Object.keys(state.cartReducer.cart).length
  }
}


function mapDispatchToProps(dispatch) {
  return {
    emptyCart: () => dispatch(ACTIONS.emptyCart()),
    setStockBack: (payload) => dispatch(ACTIONS.setStockBack(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finalize);
