import React, { Component } from 'react'
import { Form, Button, Row, Container, Col, Badge } from 'react-bootstrap'
import { Redirect } from "react-router-dom";

export default class UploadProductForm extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this)
        this.sku = React.createRef()
        this.name = React.createRef()
        this.price = React.createRef()
        this.desc = React.createRef()
        this.specs = React.createRef()
        this.stock = React.createRef()
        this.warning_at = React.createRef()
        this.images = React.createRef()

        this.state = { redirect : false}
    }


    setRedirect = () => {
        this.setState({
          redirect: true
        })
      }

      renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/dashboard' />
        }
      }

    handleSubmit(event) {

        let error = document.getElementById('error')
        let succes = document.getElementById('succes')
        let sku = this.sku.current.value
        let name = this.name.current.value
        let price = this.price.current.value
        let desc = this.desc.current.value
        let specs = this.specs.current.value
        let stock = this.stock.current.value
        let warning_at = this.warning_at.current.value
        let images = this.images.current.files

        error.innerText = ""
        let isValid = true

        // Form validation -----------------------------------------

        function errorCreator(name, err_message) {
            isValid = false
            let insert = document.createElement("LI")
            insert.innerText = `${name} ${err_message}`
            error.appendChild(insert)
        }


        function isExist(value, name) {
            if (!value) {
                errorCreator(name, ' is required')
            }
        }

        function maxChecker(value, name, max, existFunc) {
            if (existFunc) {
                existFunc(value, name)
            }

            if (value) {
                if (value.length >= max) {
                    errorCreator(name, "is too long")
                }
            }
        }
        function specsValidator(value, name) {
            let regx = new RegExp(/^\w+\=+\w+$/)
            let arr = value.split("\n")
            let isValid = arr.every(str => regx.test(str))

            if (!value) {
                errorCreator(name, ` area must fill`)
            } else {
                if (!isValid) {
                    errorCreator(name, ` form is invalid`)
                }
            }
        }

        maxChecker(sku, "SKU", 12)
        isExist(name, "Name")
        isExist(price, "Price")
        maxChecker(desc, "Description", 240, isExist)
        specsValidator(specs, 'Specification')

    
        // Form send -----------------------------------------------------------

        if (isValid) {

                 let fd = new FormData()
                  fd.append('sku', sku)
                  fd.append('name', name)
                  fd.append('price', price)
                  fd.append('description', desc)
                  fd.append('specs', specs)
                  fd.append('stock', stock)
                  fd.append('warning_at', warning_at)
      
                  for (let [key, value] of Object.entries(images)) {
                      fd.append('images', images[key], images[key].name)
                      console.log(`${key}: ${value}  ${images[key].name} ${images[key]}`);
                    }

                    function succesCreator() {
                        isValid = false
                        let insert = document.createElement("LI")
                        insert.innerText = `Upload is succesfull`
                        succes.appendChild(insert)
  
                    }

                  fetch('http://localhost:5000/product',{
                      method: 'POST',
                      body: fd
                  })
                  .then(res => res.json())
                  .then(res => {
                    
                      error.innerHTML = ""

                      if(Object.keys(res).length === 0){
                          succesCreator()
                          setTimeout(this.setRedirect, 2000)
                      }
                

                      for(var key in res) {
                              let insert = document.createElement("LI")
                              insert.innerText = res[key]
                              error.appendChild(insert)
                      }
                  })
                  
        }
    }
    render() {
        return (


            <div>
                {this.renderRedirect()}
                <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto"><h1><Badge>New product</Badge></h1></Col>
                </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Col sm={8} style={{ borderStyle: "solid", borderWidth: '1px', borderColor: 'grey', padding: "20px" }}>

                            <Form.Group controlId="sku">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control style={this.state.sku} type="text" ref={this.sku} />
                            </Form.Group>

                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" re='name' ref={this.name} />
                            </Form.Group>

                            <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" ref={this.price} />
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" row="3" ref={this.desc} />
                            </Form.Group>

                            <Form.Group controlId="specs">
                                <Form.Label>Specs</Form.Label>
                                <Form.Control as="textarea" row="3" ref={this.specs} />
                            </Form.Group>

                            <Form.Group controlId="stock">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" ref={this.stock} />
                            </Form.Group>

                            <Form.Group controlId="warning_at">
                                <Form.Label>Warning At</Form.Label>
                                <Form.Control type="number" ref={this.warning_at} />
                            </Form.Group>

                            <Form.File.Input style={{ marginBottom: "30px" }} multiple ref={this.images} />

                            <Button variant="primary" onClick={this.handleSubmit}>
                                Submit
                                </Button>
                            <ul id="error" style={{ color: "red", listStyleType: "none" }}></ul>
                            <ul id="succes" style={{ color: "green", listStyleType: "none" }}></ul>
                        </Col>

                    </Row>


                </Container>

            </div>



        )
    }
}
