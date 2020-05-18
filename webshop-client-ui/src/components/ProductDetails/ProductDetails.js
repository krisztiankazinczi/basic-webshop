import React from 'react';
import { connect } from 'react-redux';
import * as ACTIONS from '../../store/actions/actions';


import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Typography from '@material-ui/core/Typography';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import Button from '@material-ui/core/Button';

import classes from './ProductDetails.module.css'

import ProductBox from '../ProductBox/ProductBox'
import ImageGallery from './components/ImageGallery'



class ProductPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recommendations: this.props.recommendations
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      recommendations: newProps.recommendations,
    });
}



  changeRecommendationsOrder(direction) {
    let recommendations = [...this.state.recommendations]

    if (direction > 0) {
      const firstRecommendation = recommendations.shift()
      recommendations.push(firstRecommendation)
      this.setState({ recommendations: recommendations })
      return
    }

    const lastRecommendation = recommendations.pop()
    recommendations.unshift(lastRecommendation)
    this.setState({ recommendations })
  }

  dispatchAddEvents() {
    if (this.props.product.stock !== 0) {
      this.props.addToCart({name: this.props.product.name, price: this.props.product.price, sku: this.props.product.sku})
      this.props.updateStock({sku: this.props.product.sku, quantity: -1})
    }
  }


  render() {
    if (!this.props.product) return (
      <h2>This product is not available in our store</h2>
    )

    return (
      <Grid container className={classes.ProductDetails} direction="row" justify="center">
        <Grid className={classes.ImageGallery} item lg={6} container align="center">
          <Grid item lg={12} className={classes.BigImageContainer} container>
            <ImageGallery images={this.props.orderedImages} />
          </Grid>
        </Grid>
        <Grid className={classes.ProductDescription} item lg={6} container align="start">
          <Grid item lg={12}>
            <Typography className={classes.ProductName} variant="h4">{this.props.product.name}</Typography>
            <h2 className={classes.stock}>{this.props.product.stock} Pieces on stock</h2>
            <h5>{this.props.product.description}</h5>
            {this.props.product.stock 
              ?
                <Button className={classes.Button} size="large" color="primary" variant="contained" onClick={() => this.dispatchAddEvents()}>
                    {!this.props.isProductInCart ? <div>Add to cart</div> : <div>Add another to cart</div>}
                </Button>
              :
                <Typography className={classes.outOfStock} variant="h3" component="h3" color="secondary">Out of Stock</Typography>
            } 
          </Grid>
        </Grid>
        <Grid className={classes.FullSpecs} item lg={12} container align="start">
          <Grid item lg={12}>
            <h2>Product Specifications</h2>
            <p>
              {this.props.product.specs}
            </p>
          </Grid>
        </Grid>
        <Grid className={classes.Recommendations} item lg={12} container align="center">
          <Grid item lg={12} container>
            <Grid item lg={12}>
              <h2>Recommended products</h2>
            </Grid>
            
            <Grid item lg={1}>
              {
                this.state.recommendations.length > 3 
                  ?
                    <ArrowBackIosIcon onClick={() => this.changeRecommendationsOrder(-1)} className={classes.LeftArrow} fontSize='large'></ArrowBackIosIcon>
                  :
                    ""
              }
            </Grid>
            <Grid item lg={10}>
              <GridList cellHeight={400} cols={4}>
                {this.state.recommendations.map((product, idx) => (
                  idx < 4 &&
                  <GridListTile key={product.sku + idx}>
                    {product.images.length && <ProductBox image={product.images.find(image => image.isPrimary === true).path} alt={product.name} name={product.name} sku={product.sku} price={product.price} />}
                  </GridListTile>
                ))}
              </GridList>
            </Grid>
            <Grid item lg={1}>
              {
                this.state.recommendations.length > 3
                  ?
                    <ArrowForwardIosIcon onClick={() => this.changeRecommendationsOrder(1)} className={classes.RightArrow} fontSize='large'></ArrowForwardIosIcon>
                  :
                    ""
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

  }

}


function mapStateToProps(state, props) {
  const product = state.productsReducer.products.find(product => product.sku === props.sku)
  const orderedImages = product.images.sort((x, y) => {
    return (x.isPrimary === y.isPrimary) ? 0 : x.isPrimary ? -1 : 1;
  });
  const isProductInCart = props.sku in state.cartReducer.cart ? state.cartReducer.cart[props.sku] : undefined

  const recommendations = []

  product.recommendations.forEach(recommendation => {
    const recommendedProduct = state.productsReducer.products.find(product => product.sku === recommendation)
    if (recommendedProduct) {
      recommendations.push(recommendedProduct)
    }
  })

  return {
    product,
    recommendations,
    orderedImages,
    isProductInCart
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToCart: (payload) => dispatch(ACTIONS.AddtoCart(payload)),
    updateStock: (payload) => dispatch(ACTIONS.updateStock(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
