import React from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import * as ACTIONS from '../../store/actions/actions';


import classes from './CartItem.module.css'


const CartItem = (props) => {

  const dispatchRemoveEvents = () => {
    props.removeFromCart({name: props.product.name, price: props.product.price, sku: props.product.sku})
    props.updateStock({sku: props.product.sku, quantity: +1})
  }

  const dispatchAddEvents = () => {
    if (props.product.stock !== 0) {
      props.addToCart({name: props.product.name, price: props.product.price, sku: props.product.sku})
      props.updateStock({sku: props.product.sku, quantity: -1})
    }
    
  }

    return (
        <Grid container className={classes.GridContainer} direction="row" justify="center" align="center">
          <Grid item lg={1}></Grid>
          <Grid item lg={2}>
            {props.product.image && <img className={classes.img} src={props.product.image} alt="logo"></img>}
          </Grid>
          <Grid item lg={3}><Typography variant="h5" className={classes.center}>{`${props.product.name} (${props.product.sku})`}</Typography></Grid>
          <Grid item lg={1}><RemoveCircleOutlineIcon onClick={() => dispatchRemoveEvents()} className={classes.center} fontSize='large'></RemoveCircleOutlineIcon></Grid>
          <Grid item lg={1}><Typography variant="h5" className={classes.center}>{props.product.pieces}</Typography></Grid>
          <Grid item lg={1}>
            {props.product.stock ?
            <ControlPointIcon onClick={() => dispatchAddEvents()} className={classes.center} fontSize='large'></ControlPointIcon> : ""
            }
            </Grid>
          <Grid item lg={1}><Typography variant="h3" className={classes.center}>=</Typography></Grid>
          <Grid item lg={2} align="start"><Typography variant="h5" className={classes.center}>{props.product.subTotal} HUF</Typography></Grid>
        </Grid>
    );

}


function mapDispatchToProps(dispatch) {
  return {
    addToCart: (payload) => dispatch(ACTIONS.AddtoCart(payload)),
    removeFromCart: (payload) => dispatch(ACTIONS.removeFromCart(payload)),
    updateStock: (payload) => dispatch(ACTIONS.updateStock(payload))
  }
}

export default connect(null, mapDispatchToProps)(CartItem);
