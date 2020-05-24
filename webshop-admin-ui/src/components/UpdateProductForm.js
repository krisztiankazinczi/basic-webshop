import React, { Component } from 'react'
import { Form, Button, Row, Container, Col, Badge } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import ProductImageTable from './ProductList/ProductsImageTable'


export default class UpdateProductForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: undefined,
      sku: undefined,
      name: undefined,
      price: undefined,
      description: undefined,
      specs: undefined,
      files: undefined,
      recommendations: undefined,
      selectedRecommendations: ""

    }
    this.sku = React.createRef()
    this.name = React.createRef()
    this.price = React.createRef()
    this.description = React.createRef()
    this.specs = React.createRef()
    this.stock = React.createRef()
    this.warning_at = React.createRef()
    this.images = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.ChangePrimaryImage = this.ChangePrimaryImage.bind(this)
    this.deleteImage = this.deleteImage.bind(this)
  }

  componentDidMount() {
    const sku = this.props.match.params.sku
    fetch(`http://localhost:5000/products/${sku}`, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState(() => {
          return {
            id: res.id,
            sku: res.sku,
            name: res.name,
            price: res.price,
            description: res.description,
            specs: res.specs,
            stock: res.stock,
            warning_at: res.warning_at,
            files: res.files
          }
        })
      })


    fetch(`http://localhost:5000/getSkus`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          recommendations: res.skus
        })
      })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(event) {
    let error = document.getElementById('error')
    let succes = document.getElementById('succes')
    let sku = this.sku.current.value
    let name = this.name.current.value
    let price = this.price.current.value
    let desc = this.description.current.value
    let specs = this.specs.current.value
    let stock = this.stock.current.value
    let warning_at = this.warning_at.current.value

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


      function succesCreator() {
        isValid = false
        let insert = document.createElement("LI")
        insert.innerText = `Upload is succesfull`
        succes.appendChild(insert)

      }
      console.log(`fd.name = ${fd.name}`)
      fetch(`http://localhost:5000/updateProduct/${this.state.sku}`, {
        method: 'PUT',
        body: fd
      })
        .then(res => res.json())
        .then(res => {

          error.innerHTML = ""

          if (Object.keys(res).length === 0) {
            succesCreator()
            setTimeout(() => { succes.innerHTML = "" }, 2000)
          }


          for (var key in res) {
            let insert = document.createElement("LI")
            insert.innerText = res[key]
            error.appendChild(insert)
          }
        })

    }
  }

  ChangePrimaryImage(id) {
    fetch(`http://localhost:5000/files/${id}`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ files: res })
      })
  }

  deleteImage(id) {
    fetch(`http://localhost:5000/files/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ files: res.images })
      })
  }

  uploadImages(sku) {
    const images = this.images.current.files
    let fd = new FormData()


    for (let [key, value] of Object.entries(images)) {
      fd.append('images', images[key], images[key].name)
    }

    fetch(`http://localhost:5000/products/${sku}/files`, {
      method: 'POST',
      body: fd
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({ files: res.images })
      })

  }

  //to select as many as recommendations admin wants
  handleSelect(evt) {
    this.setState({selectedRecommendations: [...evt.target.selectedOptions].map(o => o.value)});
  }


  updateRecommendedProducts() {
    const recommendations = this.state.selectedRecommendations

    fetch(`http://localhost:5000/recommendations/${this.state.sku}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({recommendations})
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        // this.setState({ files: res.images })
      })
  }



  render() {
    return (

      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto"><h1><Badge>Update Product Details</Badge></h1></Col>
          </Row>
          <Row className="justify-content-md-center mt-2">
            <Col sm={8} style={{ borderStyle: "solid", borderWidth: '1px', borderColor: 'grey', padding: "20px" }}>

              <Form.Group onChange={(e) => this.handleChange(e)}>
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" ref={this.sku} disabled value={this.state.sku ? this.state.sku : ''} ></Form.Control>

                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" ref={this.name} value={this.state.name ? this.state.name : ''} />

                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" ref={this.price} value={this.state.price ? this.state.price : ''} />

                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows="5" name="description" ref={this.description} value={this.state.description ? this.state.description : ''} />

                <Form.Label>Specs</Form.Label>
                <Form.Control as="textarea" rows="5" name="specs" ref={this.specs} value={this.state.specs ? this.state.specs : ''} />

                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" name="stock" ref={this.stock} value={this.state.stock ? this.state.stock : ''} />

                <Form.Label>Warning At</Form.Label>
                <Form.Control type="number" name="warning_at" ref={this.warning_at} value={this.state.warning_at ? this.state.warning_at : ''} />
              </Form.Group>


              <Button variant="primary" onClick={this.handleSubmit}>
                Update
              </Button>
              <ul id="error" style={{ color: "red", listStyleType: "none" }}></ul>
              <ul id="succes" style={{ color: "green", listStyleType: "none" }}></ul>
            </Col>

          </Row>


        </Container>
        <div>{this.state.files ? <ProductImageTable data={this.state.files} thead={['Image', 'Path', 'URL', 'Operations']} changePrimaryImage={this.ChangePrimaryImage} deleteImage={this.deleteImage} /> : ""}</div>

        {
          this.state.sku
            ?
            <div>
              <h2>Upload new pictures to this product</h2>
              <Form.File.Input style={{ marginTop: "30px" }} multiple ref={this.images} />

              <Button variant="primary" onClick={() => this.uploadImages(this.state.sku)}>
                Upload new images
              </Button>
            </div>
            :
            ""
        }

        {
          this.state.recommendations &&
            <div className="mt-5 w-50">
              <h2>Select recommended products for this product</h2>
              <select multiple onChange={(e) => this.handleSelect(e)}>
                {
                  this.state.recommendations.map((sku, idx) => {
                    return (<option key={idx} value={sku.sku}>{sku.name}</option>)
                  })
                }
              </select>
              <Button variant="primary" onClick={() => this.updateRecommendedProducts()}>
                Update recommended products
              </Button>
            </div>
        }



      </div>



    )
  }




}