import React from 'react';

import * as ACTIONS from '../../store/actions/actions';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';


import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom'

import classes from './ProductBox.module.css'

class ProductBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      alt: this.props.alt,
      sku: this.props.sku,
      name: this.props.name,
      price: this.props.price,
      image: this.props.image,
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      alt: newProps.alt,
      sku: newProps.sku,
      name: newProps.name,
      price: newProps.price,
      image: newProps.image,
    });
}


  dispatchRemoveEvents() {
    this.props.removeFromCart({name: this.props.name, price: this.props.price, sku: this.props.sku})
    this.props.updateStock({sku: this.props.sku, quantity: +1})
  }

  dispatchAddEvents() {
    // basically the user can not see this button if this.props.stock === 0, but safety first 
    if (this.props.stock !== 0) {
      this.props.addToCart({name: this.props.name, price: this.props.price, sku: this.props.sku})
      this.props.updateStock({sku: this.props.sku, quantity: -1})
    }
    
  }


  render() {
    return (
            <Card className={classes.Card} >
              <CardActionArea>
              <Link to={`/product/${this.state.sku}`}>
                <CardMedia className={classes.center}>
                  <img className={classes.CardMedia} src={this.state.image} alt={this.state.alt}/>
                </CardMedia>
                <CardContent>
                  <Typography className={classes.properties} gutterBottom variant="subtitle1" component="h4">
                    <div>{this.state.name.length < 10 ? this.state.name : `${this.state.name.substring(0, 8)}...`}</div>
                    <div>{this.state.sku}</div>
                    <div>{this.state.price} HUF</div>
                  </Typography>
                </CardContent>
                </Link>
              </CardActionArea>
              <CardActions className={classes.CartButton}>
                <Grid container direction="row" justify="center">
                  <Grid item lg={5}>
                    {this.props.isProductInCart &&
                      <Button size="small" color="secondary" variant="contained" onClick={() => this.dispatchRemoveEvents()}>
                        Remove one
                      </Button>
                    }
                  </Grid>
                  <Grid item lg={1}>
                    {this.props.isProductInCart && 
                      <Typography variant="subtitle1" component="h4">
                        {this.props.isProductInCart.pieces}
                      </Typography>
                    }
                  </Grid>
                  <Grid item lg={5}>
                    {
                      this.props.stock 
                        ?
                          <Button size="small" color="primary" variant="contained" onClick={() => this.dispatchAddEvents()}>
                            {!this.props.isProductInCart ? <div>Add to cart</div> : <div>Add another</div>}
                          </Button>
                        : 
                          <Typography variant="subtitle1" component="subtitle1" color="secondary">Out of Stock</Typography>
                    }
                  </Grid>

                </Grid>
              </CardActions>
            </Card>
    );
  }

}


function mapStateToProps(state, props) {
  const isProductInCart = state.cartReducer.cart.hasOwnProperty(props.sku) ? state.cartReducer.cart[props.sku] : undefined
  let stock = state.productsReducer.products.find(product => product.sku === props.sku)
  if (stock) stock = stock.stock
  return {
    isProductInCart,
    stock
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToCart: (payload) => dispatch(ACTIONS.AddtoCart(payload)),
    removeFromCart: (payload) => dispatch(ACTIONS.removeFromCart(payload)),
    updateStock: (payload) => dispatch(ACTIONS.updateStock(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductBox);

