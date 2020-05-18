import React from 'react';

import Grid from '@material-ui/core/Grid';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import classes from './ImageGallery.module.css'

class ImageGallery extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      pathOfBigPic: this.props.images.find(image => image.isPrimary === true).path,
      smallImages: this.props.images
    }
  }

  //if ParentComponent updated, this Component didn't updated without this lifecycle method
  componentWillReceiveProps(newProps) {
    this.setState({
      smallImages: newProps.images,
      pathOfBigPic: newProps.images.find(image => image.isPrimary === true).path,
    });
}


  changeBigPic(id) {
    const path = this.state.smallImages[id].path
    this.setState({ pathOfBigPic: path })
  }

  changeSmallPics(direction) {
    let smallImgs = [...this.state.smallImages]
    if (direction > 0) {
      const firstImage = smallImgs.shift()
      smallImgs.push(firstImage)
      this.setState({ smallImages: smallImgs })
      return
    }

    const lastImage = smallImgs.pop()
    smallImgs.unshift(lastImage)
    this.setState({ smallImages: smallImgs })
  }



  render() {

    if (!this.props.images.length) return (<div></div>)

    return (
      <div>
        <Grid item lg={1}></Grid>
        <Grid item lg={11}>
          <img className={classes.bigImg} src={this.state.pathOfBigPic} alt="MainImage"></img>
        </Grid>
        <Grid className={classes.smallImageContainer} item lg={12} container>
          <Grid item lg={1}>
            {this.props.images.length > 3 && <ArrowBackIosIcon onClick={() => this.changeSmallPics(-1)} className={classes.Arrow} fontSize='large'></ArrowBackIosIcon>}
          </Grid>
          <Grid item lg={3}>
            <img className={classes.smallImg} onClick={() => this.changeBigPic(0)} src={this.state.smallImages[0].path} alt="logo"></img>
          </Grid>
          <Grid item lg={3}>
            {this.state.smallImages.length > 1 && <img className={classes.smallImg} onClick={() => this.changeBigPic(1)} src={this.state.smallImages[1].path} alt="logo"></img>}
          </Grid>
          <Grid item lg={3}>
            {this.state.smallImages.length > 2 && <img className={classes.smallImg} onClick={() => this.changeBigPic(2)} src={this.state.smallImages[2].path} alt="logo"></img>}
          </Grid>
          <Grid item lg={1}>
            {this.props.images.length > 3 && <ArrowForwardIosIcon onClick={() => this.changeSmallPics(1)} className={classes.Arrow} fontSize='large'></ArrowForwardIosIcon>}
          </Grid>
          <Grid item lg={1}></Grid>
        </Grid>
      </div>
    );
  }

}

export default ImageGallery;