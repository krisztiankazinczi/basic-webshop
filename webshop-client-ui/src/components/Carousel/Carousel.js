import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'


import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';

import classes from './Carousel.module.css'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


class Carousel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRadioBtn: this.props.offers[0].product_sku
    }
  }

  carouselChanging() {
      const whichIsActualPicIndex = this.props.offers.findIndex(offer => offer.product_sku === this.state.selectedRadioBtn)
      let newPicIndex = 0;
      if (whichIsActualPicIndex !== this.props.offers.length - 1) {
        newPicIndex = whichIsActualPicIndex + 1;
      }
      this.setState( { selectedRadioBtn: this.props.offers[newPicIndex].product_sku } )
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.carouselChanging(),
      3000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  



  changeOffer(direction) {
    let selectedRadioBtn = 0;
    const idxOfSelected = this.props.offers.findIndex(offer => offer.product_sku === this.state.selectedRadioBtn);

    // console.log(selectedRadioBtn = idxOfSelected + direction)
    // if (idxOfSelected !== this.state.offers.length - 1 && idxOfSelected !== 0) {
    //   selectedRadioBtn = idxOfSelected + direction
    // } 
    // else if (idxOfSelected === 0 && direction === -1) {
    //   selectedRadioBtn = this.state.offers.length - 1
    // }
    // else if(idxOfSelected === this.state.offers.length - 1 && direction === 1) {
    //   selectedRadioBtn = 0;
    // } 
    // this.setState({ selectedRadioBtn: this.state.offers[selectedRadioBtn].product_sku })
    if (direction > 0) {
      if (idxOfSelected !== this.props.offers.length - 1) selectedRadioBtn = idxOfSelected + 1
      this.setState({ 
        selectedRadioBtn: this.props.offers[selectedRadioBtn].product_sku
      })
      return
    }

    if (idxOfSelected !== 0) selectedRadioBtn = idxOfSelected - 1
    else if (idxOfSelected === 0) selectedRadioBtn = this.props.offers.length - 1
    this.setState({ 
      selectedRadioBtn: this.props.offers[selectedRadioBtn].product_sku
    })

  }

  handleChange(product_sku) {
    this.setState( {
      selectedRadioBtn: product_sku
    })
  };

  
  render() {
    if (!this.props.offers.length) return (<div></div>)

    const selectedOffer = this.props.offers.find(offer => offer.product_sku === this.state.selectedRadioBtn)

    return (
      
      <Grid container className={classes.Carousel} direction="column" justify="center" align="center">
        <Grid className={classes.img} item lg={12} style={{ backgroundImage: `url(${selectedOffer.imagePath})` }}>
          <Typography className={classes.MarketingText} variant="h2">{selectedOffer.marketingText}</Typography>
          <ArrowBackIosIcon onClick={ () => this.changeOffer(-1)} className={classes.LeftArrow} fontSize='large'></ArrowBackIosIcon>
          <ArrowForwardIosIcon onClick={ () => this.changeOffer(1)} className={classes.RightArrow} fontSize='large'></ArrowForwardIosIcon>
          <Link to={`/product/${selectedOffer.product_sku}`}>
            <Typography className={classes.ProductLink} variant="h2">Check it</Typography>
          </Link>
          <div className={classes.RadioButtons} onChange={(e) => this.handleChange(e.target.value)}>
            {this.props.offers.map( (offer, idx) => {
              return <Radio key={idx} value={offer.product_sku} checked={this.state.selectedRadioBtn === offer.product_sku ? true : false} />
            })}
          </div>
        </Grid>
      </Grid>

    );
  }

}


function mapStateToProps(state) {
  return {
    offers: state.offeringReducer.offers
  }
}

export default connect(mapStateToProps, null)(Carousel);
