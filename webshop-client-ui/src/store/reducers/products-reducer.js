import * as ACTION_TYPES from '../actions/action_types'

import {products} from './data-for-test'

const initialState = {
  products
}

const productsReducer = (state = initialState, action) => {
  let updatedProducts
  
    switch(action.type) {
      case ACTION_TYPES.UPDATE_STOCK:
        const productIndex = state.products.findIndex(product => product.sku === action.payload.sku)

        if (productIndex === -1) {
          return {...state}
        }

        const firstSliceOfProducts = state.products.slice(0, productIndex)
        const modifiedProduct = {...state.products[productIndex], stock: state.products[productIndex].stock + action.payload.quantity} 
        const restOfProducts = state.products.slice(productIndex + 1)

        updatedProducts = firstSliceOfProducts.concat(modifiedProduct).concat(restOfProducts)
        
        return {
          ...state,
          products: updatedProducts
        }

      case ACTION_TYPES.SET_STOCK_BACK:
          // let products = [...state.products]

          console.log(state.products[2])
          let products = [...state.products]
          console.log('itt')
          state.products.forEach((sp, i) => console.log(state.products[i] === products[i]))

          
          updatedProducts = products.map(product => {
            const item = action.payload.find( inCart => inCart.sku === product.sku)
             if (item) {
              product.stock += item.pieces
             }
             return product
          })

          return {
            ...state,
            products: [...updatedProducts]
          }

      default:
        return state
    }
}

export default productsReducer;
