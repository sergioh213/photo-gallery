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

class ExampleComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        // this.props.dispatch(getProfile());
    }
    logout() {
        console.log("logout function happening");
        axios.post("/logout").then()
    }
    render() {
        console.log("regular nav bar rendering");
        console.log("NAV BAR this.props: ", this.props);
        return (
            <Main>
                <NavButton><Link to={this.props.admin ? "/admin/home" : "/"}><Icon className="fas fa-home"></Icon></Link></NavButton>
            </Main>
        )
    }
}

export default connect(mapStateToProps)(ExampleComponent)
