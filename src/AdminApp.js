import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import AdminPage from './AdminPage'
import Security from './Security'
import AdminNavBar from './AdminNavBar'
import MainPage from './MainPage'

class AdminApp extends Component {
    render() {
        console.log("AdminApp rendering. Location: ", location.pathname);
        return (
            <div className="App">
                <BrowserRouter>
                    <div>
                        <AdminNavBar />
                        <Route exact path='/' component={MainPage} />
                        <Route exact path='/admin' component={AdminPage} />
                        <Route exact path='/admin/security' component={Security} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default AdminApp;
