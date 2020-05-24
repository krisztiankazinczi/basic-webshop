import React, {Component} from 'react'
import ProductTable from './ProductTable'



export default class ProductList extends Component{
    constructor(){
        super()
        this.state = {data: null}
    }


    componentDidMount() {
        fetch('http://localhost:5000/products', {
            method:'GET'
        }).then(res => res.json())
        .then(res => {
          console.log(res)
             this.setState({data: res})
        })

    }

    render(){
        return(
        <div>{this.state.data? <ProductTable data={this.state.data}/>: ""}</div>
        )
    }
}