import React, { Component } from 'react'
import { Table, Container, Row, Col, Badge, Button } from 'react-bootstrap'

import Cell from './ProductList/Cell'
import Picture from './ProductList/Picture'

export default class Offers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offers: undefined
    }
  }

  componentDidMount() {
    fetch('http://localhost:5000/findOffers', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          offers: res.offers
        })
      })      
  }

  deleteOffer(id, imagePath) {
    fetch(`http://localhost:5000/offer/${id}/${imagePath}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(res => {
        if (!Object.keys(res).length) {
          const offers = [...this.state.offers].filter(offer => offer.id !== id)
          this.setState({ offers })
          console.log(this.state.offers)
        }
        
      })
  }


  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><h1><Badge>Special Offers</Badge></h1></Col>
        </Row>
        <Row className="justify-content-md-center mt-5">
          <Col sm={10}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Offer Image</th>
                  <th>Product SKU</th>
                  <th>Marketing Text</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.offers &&
                  this.state.offers.map((row, idx) => {
                    return (
                      <tr key={idx}>
                        <td><Picture path={`/offers/${row.imagePath}`} /></td>
                        <td><Cell text={row.product_sku} /></td>
                        <td><Cell text={row.marketingText} /></td>
                        <td><Button variant="danger" onClick={() => this.deleteOffer(row.id, row.imagePath)}>Delete</Button></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }

}