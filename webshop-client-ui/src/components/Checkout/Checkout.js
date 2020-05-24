import React from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import classes from './Checkout.module.css'

import validate from '../../validation/general-basic-validation'

import * as ACTIONS from '../../store/actions/actions';


class Checkout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      email: "",
      address: "",
      nameError: false,
      emailError: false,
      addressError: false
    }
  }


  handleChange(event) {
    // this.setState( () => {
    //   return {
    //     [event.target.name]: event.target.value
    //   }
    // })
    this.setState({ [event.target.name]: event.target.value })

  }


  handleSubmit() {
    const error = document.getElementById('error')
    const success = document.getElementById('success')

    this.setState({
      addressError: false,
      nameError: false,
      emailError: false
    })
    error.innerHTML = ""
    success.innerHTML = ""

    if (!this.props.cart.length) {
      error.innerHTML = "Your cart is empty! We can not checkout this."
      return
    }

    const name = this.state.name
    const email = this.state.email
    const address = this.state.address


    const isAnyError = validate({ name, email, address })

    if (Object.keys(isAnyError).length) {
      Object.entries(isAnyError).forEach(([key, value]) => {
        if (key === 'name') this.setState({ nameError: true })
        else if (key === 'email') this.setState({ emailError: true })
        else if (key === 'address') this.setState({ addressError: true })

        error.innerHTML += value + '\n'
        return
      })
    }
    const data = { name, email, address, cart: this.props.dataToServer }

    fetch('http://localhost:5000/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (!Object.keys(res).length) {
          success.innerHTML = 'We have saved your order. We will inform you via email if we provided your order to the courier.'
          this.props.emptyCart()
          this.setState({
            name: "",
            email: "",
            address: ""
          })
          return
        }

        Object.entries(res).forEach(([key, value]) => {
          if (key === 'name') this.setState({ nameError: true })
          else if (key === 'email') this.setState({ emailError: true })
          else if (key === 'address') this.setState({ addressError: true })

          error.innerHTML += value + '\n'
          return
        })

      })
      .catch(res => {
        error.innerHTML = "We are sorry, but we were not able to communicate with th server. Please try again in a few minutes."
      })
  }

  render() {
    return (
      <Grid container className={classes.MainContainer} direction="row" justify="center">
        <Grid className={classes.CartDetails} item lg={6} container align="center">
          <Typography variant="h4">Cart Summary</Typography>
          <ul>
            {this.props.cart.length ?
              this.props.cart.map((product, idx) => {
                return (<li key={idx}>{product.pieces} x {product.name} = {product.price} HUF</li>)
              })
              : ''
            }
            {this.props.cart.length ? <hr></hr> : ''}
            {this.props.cart.length ? <li>Total = {this.props.totalValue} HUF</li> : ''}
          </ul>
        </Grid>
        <Grid item lg={6} container align="end">
          <Grid className={classes.field} item lg={12} container>
            <Grid item lg={4}>
              <Typography variant="h4">Name</Typography>
            </Grid>
            <Grid className={classes.inputField} item lg={8} align="center">
              <TextField
                className={!this.state.nameError ? classes.inputField : `${classes.inputField}, ${classes.errorBorder}`}
                label="Name"
                variant="filled"
                name="name"
                value={this.state.name}
                onChange={(e) => this.handleChange(e)}
              />
            </Grid>
          </Grid>
          <Grid className={classes.field} item lg={12} container>
            <Grid item lg={4}>
              <Typography variant="h4">Email</Typography>
            </Grid>
            <Grid item lg={8} align="center">
              <TextField
                className={!this.state.emailError ? classes.inputField : `${classes.inputField}, ${classes.errorBorder}`}
                label="Email" name="email"
                variant="filled"
                value={this.state.email}
                onChange={(e) => this.handleChange(e)}
              />
            </Grid>
          </Grid>
          <Grid className={classes.field} item lg={12} container>
            <Grid item lg={4}>
              <Typography variant="h4">Address</Typography>
            </Grid>
            <Grid item lg={8} align="center">
              <TextField
                className={!this.state.addressError ? classes.inputField : `${classes.inputField}, ${classes.errorBorder}`}
                label="Address"
                name="address"
                variant="filled"
                value={this.state.address}
                onChange={(e) => this.handleChange(e)}
              />
            </Grid>
          </Grid>
          <Grid className={classes.field} item container lg={12} >
            <Typography id="error" variant="h5" color="secondary"></Typography>
            <Typography id="success" variant="h5" color="primary"></Typography>
          </Grid>
          <Grid className={classes.field} item container lg={12} align="center">
            <Grid item lg={4}></Grid>
            <Grid item lg={8}>
              {this.props.totalValue
                ?
                <Button
                  onClick={(e) => this.handleSubmit(e)}
                  className={classes.buttons}
                  size="large"
                  color="primary"
                  variant="contained"
                >
                  Checkout
                  </Button>
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
  let totalValue = 0
  if (Object.values(state.cartReducer.cart).length) {
    totalValue = Object.values(state.cartReducer.cart).reduce((total, actual) => total = total + actual.price, 0)
  }

  const dataToServer = []

  Object.values(state.cartReducer.cart).forEach(cartItem => {
    const product = state.productsReducer.products.find(p => p.name === cartItem.name)
    if (product) {
      dataToServer.push({ sku: product.sku, pieces: cartItem.pieces, totalPrice: cartItem.price })
    }
  })


  return {
    cart: Object.values(state.cartReducer.cart),
    totalValue,
    dataToServer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    emptyCart: () => dispatch(ACTIONS.emptyCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);