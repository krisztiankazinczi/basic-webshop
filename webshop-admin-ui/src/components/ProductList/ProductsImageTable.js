
import React, { Component } from 'react'
import { Table, Container, Row, Col, Badge, Button } from 'react-bootstrap'
import TableRow from './TableRow'
import Cell from './Cell'
import Picture from './Picture'

export default class ProductImageTable extends Component {
  constructor(props) {
    super(props)
    this.setPrimaryImage = this.setPrimaryImage.bind(this)
    this.deleteImage = this.deleteImage.bind(this)
  }


  setPrimaryImage(id) {
    this.props.changePrimaryImage(id)
  }

  deleteImage(id) {
    this.props.deleteImage(id)
  }


  render() {
    return (

      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><h1><Badge>Products</Badge></h1></Col>
        </Row>

        <Row className="justify-content-md-center mt-5">
          <Col sm={10} >
            <Table striped bordered hover>
              <thead>
                <tr>
                  {
                  this.props.thead.map((head, index) => {
                    return (
                      <th key={index}>{head}</th>
                    )
                  })
                  }
                </tr>
              </thead>
              <tbody>
                {this.props.data
                  ?
                  this.props.data.map((file, idx) => {
                   return(
                    <tr key={idx} className={file.isPrimaryImage == 1 ? "bg-primary" : ""}>
                      <td><Picture path={file.path} /></td>
                      <td><Cell text={file.path} /></td>
                      <td><Cell text={`http://localhost:5000/${file.path}`} /></td>
                      <td><Button variant="secondary" onClick={() => this.setPrimaryImage(file.id)}>Set Primary Image</Button></td>
                      <td><Button variant="danger" onClick={() => this.deleteImage(file.id)}>Delete</Button></td>
                    </tr>
                   ) 
                  })
                  :
                  ""
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}

