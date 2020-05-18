import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


import logo from '../../webshop-logo.svg'

import classes from './Footer.module.css'

import { Link } from "react-router-dom";


const Footer = () => {

    return (
      <Grid className={classes.GridContainer} container direction="row" justify="center" align="center">
        <Grid item lg={2} container>
          <Grid item lg={12}>
            <Link to="/"><img className={classes.img} src={logo} alt="logo"></img></Link>
          </Grid>
        </Grid>
        <Grid className={classes.list} item lg={3} container>
          <Grid item lg={12}>
            <Typography variant="h6">About us</Typography>
            <ul>
              <li><Link to="/">Introduction</Link></li>
              <li><Link to="/">Prices</Link></li>
              <li><Link to="/">Recognitions</Link></li>
              <li><Link to="/">Awards</Link></li>
              <li><Link to="/">Blog</Link></li>
            </ul>
          </Grid>
        </Grid>
        <Grid className={classes.list} item lg={3} container>
          <Grid item lg={12}>
            <Typography variant="h6">Help</Typography>
            <ul>
              <li><Link to="/">Services</Link></li>
              <li><Link to="/">Newsletter</Link></li>
              <li><Link to="/">Feedback</Link></li>
              <li><Link to="/">Buy helping functions</Link></li>
            </ul>
          </Grid>
        </Grid>
        <Grid className={classes.list} item lg={3} container>
          <Grid item lg={12}>
            <Typography variant="h6">Partners</Typography>
            <ul>
              <li><Link to="/">Partner Portal</Link></li>
              <li><Link to="/">Cart Program</Link></li>
              <li><Link to="/">Product Ads</Link></li>
              <li><Link to="/">Trusted Shop</Link></li>
            </ul>
          </Grid>
        </Grid>
      </Grid>
    )
}

export default Footer;
