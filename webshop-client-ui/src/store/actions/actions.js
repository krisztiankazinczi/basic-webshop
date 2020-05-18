import * as ACTION_TYPES from './action_types'


export const AddtoCart = (payload) => {
  return {
    type: ACTION_TYPES.ADD_ITEM_TO_CART,
    payload
  }
}

export const removeFromCart = (payload) => {
  return {
    type: ACTION_TYPES.REMOVE_ITEM_FROM_CART,
    payload
  }
}

export const updateStock = (payload) => {
  return {
    type: ACTION_TYPES.UPDATE_STOCK,
    payload
  }
}

export const emptyCart = () => {
  return {
    type: ACTION_TYPES.EMPTY_CART
  }
}

export const setStockBack = (payload) => {
  return {
    type: ACTION_TYPES.SET_STOCK_BACK,
    payload
  }
}