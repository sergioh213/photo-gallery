import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import AdminApp from './AdminApp'
import { Provider } from 'react-redux';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { init } from './socket'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let component;

if ( (location.pathname == "/admin" || (location.pathname.indexOf('/admin') != -1)) ) {
    console.log("START location /admin");
    component = (
        <Provider store={ store }>
            <AdminApp />
        </Provider>
    );
    // init(store)
} else {
    console.log("START location ", location.pathname);
    component = (
        <Provider store={ store }>
            <App />
        </Provider>
    );
}

ReactDOM.render(
    component,
    document.querySelector('main')
);
