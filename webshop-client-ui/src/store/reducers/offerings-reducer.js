import * as ACTION_TYPES from '../actions/action_types'

import {offers} from './data-for-test'

const initialState = {
  offers: [
    // {
    //   marketingText: 'Best Laptop On Market!!!',
    //   imagePath: 'https://p1.akcdn.net/full/652741488.msi-gl65-9se-9s7-16u512-262hu.jpg',
    //   product_sku: 'KG99N'
    // }
  ]
}

const offeringReducer = (state = initialState, action) => {
    switch(action.type) {
      case ACTION_TYPES.GET_OFFERS:
        // action.payload.offers.forEach(o => console.log(o))
        return {
          ...state,
          offers: action.payload.offers
        }
      default:
        return state
    }
}

export default offeringReducer;
