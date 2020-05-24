import React, { Component } from 'react'
import { Table, Container, Row, Col, Badge, Button } from 'react-bootstrap'

import Cell from './ProductList/Cell'

export default class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: undefined
    }
  }

  componentDidMount() {
    fetch('http://localhost:5000/findOrders', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        // this.setState({
        //   orders: res.orders
        // })
      })      
  }

  // deleteOffer(id, imagePath) {
  //   fetch(`http://localhost:5000/offer/${id}/${imagePath}`, {
  //     method: 'DELETE'
  //   })
  //     .then(res => res.json())
  //     .then(res => {
  //       if (!Object.keys(res).length) {
  //         const offers = [...this.state.offers].filter(offer => offer.id !== id)
  //         this.setState({ offers })
  //         console.log(this.state.offers)
  //       }
        
  //     })
  // }


  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><h1><Badge>Orders</Badge></h1></Col>
        </Row>
        <Row className="justify-content-md-center mt-5">
          <Col sm={10}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Done</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.orders &&
                  this.state.orders.map((row, idx) => {
                    return (
                      <tr key={idx}>
                        <td><Cell text={row.name} /></td>
                        <td><Cell text={row.address} /></td>
                        <td><Cell text={row.email} /></td>
                        <td>
                          <ul>

                          </ul>
                        </td>
                        <td><Button variant="success">Done</Button></td>
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