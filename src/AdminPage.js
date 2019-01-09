import React, {Component} from 'react'
import styled from 'styled-components'
import axios from './axios'

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        axios.get("/admin.json").then(({data}) => console.log("data: ", data))
    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.post("/admin.json", this.state).then(({data}) => {
            console.log("data received from server: ", data);
            if (data.success) {
                location.replace("/session")
            } else {

            }
        })
    }

    render() {
        const Main = styled.div`
            position: relative;
        `
        return (
            <div>
                Admin Page
                <form action="/admin.json">
                    <input onChange={ this.handleChange } name="password" placeholder='Password' type='password' />
                    <button onClick={(e) => this.handleSubmit(e) }>submit</button>
                </form>
            </div>
        )
    }
}

export default AdminPage
