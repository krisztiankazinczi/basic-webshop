import * as ACTION_TYPES from '../actions/action_types'

import {cart} from './data-for-test'

const initialState = {
  cart
}

const cartReducer = (state = initialState, action) => {
  let isProductInCart, product ;

    switch(action.type) {
      case ACTION_TYPES.ADD_ITEM_TO_CART:
        isProductInCart = action.payload.sku in state.cart 
        product = state.cart[action.payload.sku]
        return {
          ...state,
          cart: !isProductInCart
                    ?
                      {...state.cart, [action.payload.sku]: {name: action.payload.name, pieces: 1, price: action.payload.price}}
                    : 
                      {...state.cart, [action.payload.sku]: {...product, pieces: product.pieces += 1, price: product.price += action.payload.price} }
        }

      case ACTION_TYPES.REMOVE_ITEM_FROM_CART:
        isProductInCart = action.payload.sku in state.cart 
        
        product = isProductInCart ? state.cart[action.payload.sku] : undefined

        //if after modification the pieces of product would be 0, I delete the product from the cart object
        if (product && product.pieces - 1 === 0) {
          const newState = {...state}
          delete newState.cart[action.payload.sku]
          return {
            ...newState
          }
        }
        return {
          ...state,
          cart: isProductInCart
                    ?
                      {...state.cart, [action.payload.sku]: {...product, pieces: product.pieces -= 1, price: product.price -= action.payload.price} }
                    : 
                      {...state.cart}  

        }

        case ACTION_TYPES.EMPTY_CART:
          return {
            ...state,
            cart: {}
          }
          
      default:
        return state
    }
}

export default cartReducer;
