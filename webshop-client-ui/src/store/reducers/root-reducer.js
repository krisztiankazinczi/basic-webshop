import { combineReducers } from 'redux';
import cartReducer from './cart-reducer'
import offeringReducer from './offerings-reducer'
import productsReducer from './products-reducer'


const rootReducer = combineReducers({
  productsReducer,
  offeringReducer,
  cartReducer
})

export default rootReducer;
