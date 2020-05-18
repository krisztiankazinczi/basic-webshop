// import * as ACTION_TYPES from '../actions/action_types'

import {offers} from './data-for-test'

const initialState = {
  offers
}

const offeringReducer = (state = initialState, action) => {
    switch(action.type) {
      default:
        return state
    }
}

export default offeringReducer;
