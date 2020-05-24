import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

import rootReducer from './store/reducers/root-reducer'

import * as ACTIONS from './store/actions/actions';

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware()
));

// const  getDataFromServer = async() => {
//   fetch('http://localhost:5000/productsToClients', {
//       method: 'GET'
//     })
//       .then(res => res.json())
//       .then(res => {
//         dispatch(ACTIONS.getDataFromServer({products: res.products}))
//       })
// }

// store.dispatch(getDataFromServer())


ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>,
                document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

