import React, {Component} from 'react'
import { connect } from 'react-redux';
// import { getProfile } from './redux-socket/actions.js'
import styled from 'styled-components'
import axios from './axios'
import { Link } from 'react-router-dom'

const mapStateToProps = state => {
    return {
        profile: state.profile
    }
}

const Main = styled.div`
    background-color: cyan;
    padding: 5px;
    display: flex;
    justify-content: space-between;
`
const NavButton = styled.button`
    background-color: rgba(0, 0, 0, 0);
    border: none;
    margin: 0;
    margin-right: 10px;
    padding: 0;
    font-size: 16px;
`
const Icon = styled.i`
    color: white;
`

class AdminNavBar extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount() {}

    render() {
        console.log("admin nav bar rendering");
        return (
            <Main>
                <NavButton><Link to="/"><Icon className="fas fa-home"></Icon></Link></NavButton>
                <div>
                    <NavButton><Link to="/admin"><Icon className="fas fa-th"></Icon></Link></NavButton>
                    <NavButton><Link to="/admin/security"><Icon className="fas fa-key"></Icon></Link></NavButton>
                    <NavButton><a href="/logout"><Icon className="fas fa-sign-out-alt"></Icon></a></NavButton>
                </div>
            </Main>
        )
    }
}

export default connect(mapStateToProps)(AdminNavBar)
