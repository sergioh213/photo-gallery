import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import NavBar from './NavBar'
import MainPage from './MainPage'
import AdminPage from './AdminPage'
import Session from './Session'

class App extends Component {
    render() {
        return (
            <div className="App">
                <NavBar />
                <BrowserRouter>
                    <div>
                        <Route exact path='/' component={MainPage} />
                        <Route path='/admin' component={AdminPage} />
                        <Route path='/session' component={Session} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
