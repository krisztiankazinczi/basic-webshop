import React, {Component} from 'react'
import {
    NavLink
  } from "react-router-dom";

export default class Header extends Component{
    render(){
        return(
      <nav>
        <ul>
          <li>
            <NavLink to="/dashbord" 
              activeStyle={{
              fontWeight: "bold"
            }}>
              Dashboard
            </NavLink>
          </li>
          <li>
          <NavLink to="/products" 
                   activeStyle={{
                      fontWeight: "bold"
                    }}>
              Products
            </NavLink>
          </li>
          <li>
          <NavLink to="/upload-product" 
                   activeStyle={{
                      fontWeight: "bold"
                    }}>
              Upload New
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-offer" 
              activeStyle={{
              fontWeight: "bold"
            }}>
              New Offer
            </NavLink>
          </li>
          <li>
            <NavLink to="/offers" 
              activeStyle={{
              fontWeight: "bold"
            }}>
              Offers
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" 
              activeStyle={{
              fontWeight: "bold"
            }}>
              Orders
            </NavLink>
          </li>
        </ul>
      </nav>
        )
    }
}