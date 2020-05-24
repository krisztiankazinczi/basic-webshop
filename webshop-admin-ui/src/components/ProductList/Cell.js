import React, {Component} from 'react'

export default class Cell extends Component {

    render(){
        return(
            <div>
                {this.props.text}
            </div>
        )
    }
}