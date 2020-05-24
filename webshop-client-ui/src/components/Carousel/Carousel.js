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
      selectedRadioBtn: this.props.offers.length ? this.props.offers[0].id : ""
    }
  }

  carouselChanging() {
      const whichIsActualPicIndex = this.props.offers.findIndex(offer => offer.id === this.state.selectedRadioBtn)
      let newPicIndex = 0;
      if (whichIsActualPicIndex !== this.props.offers.length - 1) {
        newPicIndex = whichIsActualPicIndex + 1;
      }
      this.setState( { selectedRadioBtn: this.props.offers[newPicIndex].id } )
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.carouselChanging(),
      5000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  



  changeOffer(direction) {
    let selectedRadioBtn = 0;
    const idxOfSelected = this.props.offers.findIndex(offer => offer.id === this.state.selectedRadioBtn);

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
        selectedRadioBtn: this.props.offers[selectedRadioBtn].id
      })
      return
    }

    if (idxOfSelected !== 0) selectedRadioBtn = idxOfSelected - 1
    else if (idxOfSelected === 0) selectedRadioBtn = this.props.offers.length - 1
    this.setState({ 
      selectedRadioBtn: this.props.offers[selectedRadioBtn].id
    })

  }

  handleChange(id) {
    const newIdx = this.props.offers.findIndex(o => o.id == id)
    this.setState( {
      selectedRadioBtn: newIdx > -1 ? this.props.offers[newIdx].id : this.props.offers[0].id
    })
  };

  getId = () => {
    const id = Math.floor(Math.random() * 1000); 
    return id;
  };

  
  render() {
    if (!this.props.offers || !this.props.offers.length) return (<div></div>)

    const selectedOffer = this.props.offers.find(offer => offer.id === this.state.selectedRadioBtn)
    return (
      
      <Grid container className={classes.Carousel} direction="column" justify="center" align="center">
        <Grid key={this.getId()} className={classes.img} item lg={12} style={{ backgroundImage: `url(${selectedOffer.imagePath})` }}>
          <Typography className={classes.MarketingText} variant="h2">{selectedOffer.marketingText}</Typography>
          <ArrowBackIosIcon onClick={ () => this.changeOffer(-1)} className={classes.LeftArrow} fontSize='large'></ArrowBackIosIcon>
          <ArrowForwardIosIcon onClick={ () => this.changeOffer(1)} className={classes.RightArrow} fontSize='large'></ArrowForwardIosIcon>
          <Link to={`/product/${selectedOffer.product_sku}`}>
            <Typography className={classes.ProductLink} variant="h2">Check it</Typography>
          </Link>
          <div className={classes.RadioButtons} onChange={(e) => this.handleChange(e.target.value)}>
            {this.props.offers.map( (offer, idx) => {
              return <Radio key={idx} value={offer.id} checked={this.state.selectedRadioBtn === offer.id ? true : false} />
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
