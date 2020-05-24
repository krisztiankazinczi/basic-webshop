import React, {Component} from 'react'

export default class Cell extends Component {

    render(){
        return(
            <div>
                <img style={{height:"150px"}} src={`http://localhost:5000/${this.props.path}`} alt={this.props.path}/>
            </div>
        )
    }
}