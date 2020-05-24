
import React, { Component } from 'react'
import { Table, Container, Row, Col, Badge } from 'react-bootstrap'
import TableRow from './TableRow'

export default class ProductTable extends Component {

    render() {
      console.log(this.props.data)
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
                                    <th>Main Image</th>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                     this.props.data.map((row, rowIndex) => {
                                        return (
                                            <TableRow row={row} key={rowIndex} />
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

