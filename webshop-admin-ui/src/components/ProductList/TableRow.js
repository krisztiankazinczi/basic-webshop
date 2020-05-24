import React, {Component} from 'react'
import Cell from './Cell'
import Button from 'react-bootstrap/Button'
import Picture from './Picture'
import { Redirect } from "react-router-dom";

export default class TableRow extends Component{
    constructor(props){
        super(props)
        // this.toEditPage = this.toEditPage.bind(this)
    }


    toEditPage(sku) {
      window.location.href= `http://localhost:3000/products/${sku}`
      // return <Redirect to={`/${id}`} />
    }



    render(){
       console.log(this.props.row.warning_at)
        return(
          <tr 
            style={
                    !this.props.row.stock 
                  ? 
                    {backgroundColor: 'red'} 
                  :
                    this.props.row.stock < this.props.row.warning_at 
                  ?
                    {backgroundColor: 'yellow'} 
                  : 
                    {backgroundColor: 'white'}}
          >
            <td><Picture path={this.props.row.path}/></td>
            <td><Cell text={this.props.row.sku}/></td>
            <td><Cell text={this.props.row.name}/></td>
            <td><Cell text={this.props.row.price}/></td>
            <td><Cell text={this.props.row.stock}/></td>
            <td><Button variant="secondary" onClick={this.toEditPage.bind(this, this.props.row.sku)}>Edit</Button></td>
          </tr>
        )
    }
}