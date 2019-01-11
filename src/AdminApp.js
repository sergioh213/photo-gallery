import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import AdminPage from './AdminPage'
import Security from './Security'
import AdminNavBar from './AdminNavBar'
import RedAdminStripe from './RedAdminStripe'
import NavBar from './NavBar'
import MainPage from './MainPage'

class AdminApp extends Component {
    render() {
        console.log("AdminApp rendering. Location: ", location.pathname);
        return (
            <div className="App">
                <BrowserRouter>
                    <div>
                        <Route exact path='/admin/:extension' render={(props) => {
                            return <RedAdminStripe {...props} key={props.match.params.extension} />
                        }} />
                        <Route exact path='/admin' render={(props) => {
                            return <RedAdminStripe {...props} key={props.match.params.extension} />
                        }} />
                        <Route exact path='/admin/:extension' render={(props) => {
                            return <AdminNavBar {...props} key={props.match.params.extension} />
                        }} />
                        <Route exact path='/admin' render={(props) => {
                            return <AdminNavBar {...props} key={props.match.params.extension} />
                        }} />
                        <Route exact path='/admin' component={AdminPage} />
                        <Route exact path='/admin/home' component={MainPage} />
                        <Route exact path='/admin/security' component={Security} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default AdminApp;
