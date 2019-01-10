import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import MainPage from './MainPage'
import Login from './Login'
import NavBar from './NavBar'

class App extends Component {
    render() {
        console.log("Regular app rendering. Location: ", location.pathname);
        return (
            <div className="App">
                <BrowserRouter>
                    <div>
                        <NavBar />
                        <Route exact path='/' component={MainPage} />
                        <Route path='/login' component={Login} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
