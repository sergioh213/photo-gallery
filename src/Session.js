import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount() {
        axios.get("/admin.json").then(({data}) => console.log("data: ", data))
    }
    render() {
        const Main = styled.div`
            position: relative;
        `
        return (
            <Main>
                You are now logged in
            </Main>
        )
    }
}

export default AdminPage
