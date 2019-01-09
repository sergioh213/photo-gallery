import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { Provider } from 'react-redux';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>
    ,
    document.querySelector('main')
);
