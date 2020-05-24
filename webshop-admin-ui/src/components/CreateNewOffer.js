import React, { Component } from 'react'
import { Form, Container, Row, Col, Badge, Button } from 'react-bootstrap'

export default class CreateNewOffer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skus: undefined
    }
    this.images = React.createRef()
    this.selectedSku = React.createRef()
    this.marketingText = React.createRef()
  }

  componentDidMount() {
    fetch(`http://localhost:5000/getSkus`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          skus: res.skus
        })
      })
  }

  handleSubmit() {
    const marketingText = this.marketingText.current.value
    const image = this.images.current.files
    const selectedSku = this.selectedSku.current.value

    console.log(marketingText, image, selectedSku)

    const fd = new FormData()
    fd.append('marketingText', marketingText)
    fd.append('sku', selectedSku)

    for (let [key, value] of Object.entries(image)) {
      fd.append('image', image[key], image[key].name)
    }

    fetch('http://localhost:5000/createOffer', {
      method: 'POST',
      body: fd
    })
      .then(res => res.json())
      .then(res => { 
        console.log(res)
      })

  }

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><h1><Badge>Create new Offer</Badge></h1></Col>
        </Row>
        <Row className="justify-content-md-center mt-5">
          <Col sm={10}>
            <Form.Group>
              <Form.Label>MarketingText</Form.Label>
              <Form.Control type="text" name="marketingText" ref={this.marketingText} />

              <Form.Label className="mt-5">Upload the marketing picture</Form.Label><br />
              <Form.File.Input ref={this.images} />

              <Form.Label className="mt-5">Select the product from our database:</Form.Label><br />
              <select ref={this.selectedSku}>
                {
                  this.state.skus &&
                  this.state.skus.map(sku => {
                    return (<option value={sku.sku}>{sku.name}</option>)
                  })
                }
              </select>
            </Form.Group>

            <Button variant="primary" onClick={() => this.handleSubmit()}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}