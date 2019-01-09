import React, {Component} from 'react'
import { connect } from 'react-redux';
// import { getProfile } from './redux-socket/actions.js'
import styled from 'styled-components'
import axios from './axios'

const mapStateToProps = state => {
    return {
        profile: state.profile
    }
}

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
        const Main = styled.div`
            background-color: cyan;
            padding: 5px;
        `
        const LogOutButton = styled.button`
            float: right;
        `
        return (
            <Main>
                hello
                <LogOutButton><a href="/logout">logout</a></LogOutButton>
            </Main>
        )
    }
}

export default connect(mapStateToProps)(ExampleComponent)
