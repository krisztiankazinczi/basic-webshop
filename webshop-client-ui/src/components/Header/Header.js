import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import logo from '../../webshop-logo.svg'

import { Link } from 'react-router-dom'


import classes from './Header.module.css'
import Cart from './Cart.js'


const Header = () => {

    return (
        <Grid container className={classes.Header} direction="row" justify="center">
          <Grid item lg={2} container align="center">
            <Grid item lg={12}>
              <Link to="/"><img className={classes.img} src={logo} alt="logo"></img></Link>
            </Grid>           
          </Grid>
          <Grid item lg={7} container align="center">
            <Grid item lg={12}>
              <Typography variant="h2">My Webshop</Typography>
            </Grid>
          </Grid>
          <Grid item lg={3} container  align="end">
            <Grid item lg={12}>
              <Cart />
            </Grid>
          </Grid>
        </Grid>
    );
}

export default Header;
