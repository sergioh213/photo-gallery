import React, {Component} from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components'
import axios from './axios'

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        // this.props.dispatch(getProfile());
    }
    render() {
        const Main = styled.div`
            position: relative;
        `
        return (
            <Main>
                hello
            </Main>
        )
    }
}

export default MainPage
